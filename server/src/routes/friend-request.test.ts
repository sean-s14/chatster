import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { createUser } from "../../test/create-user";
import { generateAccessToken } from "../utils/jwt";
import { cleanupDatabase } from "../../test/cleanup";
import prisma from "../prismaClient";

describe("Friend Request API", () => {
  const password = "pass1234";
  let user1: any = { email: "user1@example.com" };
  let user2: any = { email: "user2@example.com" };
  let user3: any = { email: "user3@example.com" };

  let friendRequestIds: any[] = [];

  beforeAll(async () => {
    await cleanupDatabase();

    // Create user 1
    user1 = await createUser(user1.email, password);
    user1.accessToken = generateAccessToken(user1);

    // Create user 2
    user2 = await createUser(user2.email, password);
    user2.accessToken = generateAccessToken(user2);

    // Create user 3
    user3 = await createUser(user3.email, password);
    user3.accessToken = generateAccessToken(user3);
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe("Send Friend Request", () => {
    it("should send friend request from user1 to user2", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          friendId: user2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request sent");

      const friendRequests = await prisma.friendRequest.findMany({
        where: {
          senderId: user1.id,
        },
      });
      friendRequestIds = friendRequests.map((request) => request.id);
    });

    it("should send friend request from user1 to user3", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          friendId: user3.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request sent");

      const friendRequests = await prisma.friendRequest.findMany({
        where: {
          senderId: user1.id,
        },
      });
      friendRequestIds = friendRequests.map((request) => request.id);
    });
  });

  describe("Accept Friend Request", () => {
    it("should accept friend request from user2 to user1", async () => {
      const response = await request(app)
        .patch("/api/users/friends/request/accept")
        .set("Authorization", `Bearer ${user2.accessToken}`)
        .send({
          requestId: friendRequestIds[0],
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request accepted");
    });
  });

  describe("Reject Friend Request", () => {
    it("should reject friend request from user3 to user1", async () => {
      const response = await request(app)
        .patch("/api/users/friends/request/reject")
        .set("Authorization", `Bearer ${user3.accessToken}`)
        .send({
          requestId: friendRequestIds[1],
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request rejected");
    });
  });

  describe("Get Friend Requests Sent", () => {
    it("should get friend requests sent by user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request/sent")
        .set("Authorization", `Bearer ${user1.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.sentFriendRequests.length).toBe(2);

      expect(response.body.sentFriendRequests[0].senderId).toBe(user1.id);
      expect(response.body.sentFriendRequests[0].receiverId).toBe(user2.id);
      expect(response.body.sentFriendRequests[0].status).toBe("ACCEPTED");

      expect(response.body.sentFriendRequests[1].senderId).toBe(user1.id);
      expect(response.body.sentFriendRequests[1].receiverId).toBe(user3.id);
      expect(response.body.sentFriendRequests[1].status).toBe("REJECTED");
    });
  });

  describe("Get Friend Requests Received", () => {
    it("should get friend requests received by user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request/received")
        .set("Authorization", `Bearer ${user1.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.receivedFriendRequests.length).toBe(0);
    });

    it("should get friend requests received by user2", async () => {
      const response = await request(app)
        .get("/api/users/friends/request/received")
        .set("Authorization", `Bearer ${user2.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.receivedFriendRequests.length).toBe(1);

      expect(response.body.receivedFriendRequests[0].senderId).toBe(user1.id);
      expect(response.body.receivedFriendRequests[0].receiverId).toBe(user2.id);
      expect(response.body.receivedFriendRequests[0].status).toBe("ACCEPTED");
    });

    it("should get friend requests received by user3", async () => {
      const response = await request(app)
        .get("/api/users/friends/request/received")
        .set("Authorization", `Bearer ${user3.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.receivedFriendRequests.length).toBe(1);

      expect(response.body.receivedFriendRequests[0].senderId).toBe(user1.id);
      expect(response.body.receivedFriendRequests[0].receiverId).toBe(user3.id);
      expect(response.body.receivedFriendRequests[0].status).toBe("REJECTED");
    });
  });
});
