import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { generateAccessToken } from "../utils/jwt";
import { cleanupDatabase } from "../../test/cleanup";
import generateUsers from "../../test/db/generate-users";
import prisma from "../prismaClient";
import { User } from "../types/user";

let user1: User, user2: User, user3: User;
let user1accessToken: string,
  user2accessToken: string,
  user3accessToken: string;

beforeAll(async () => {
  await cleanupDatabase();
  await generateUsers();

  user1 = await prisma.user.findUniqueOrThrow({
    where: {
      email: "user001@mail.com",
    },
  });
  user2 = await prisma.user.findUniqueOrThrow({
    where: {
      email: "user002@mail.com",
    },
  });
  user3 = await prisma.user.findUniqueOrThrow({
    where: {
      email: "user003@mail.com",
    },
  });

  user1accessToken = generateAccessToken({
    id: user1.id,
    email: user1.email,
    username: user1.username,
    role: user1.role,
    image: user1.image || undefined,
  });
  user2accessToken = generateAccessToken({
    id: user2.id,
    email: user2.email,
    username: user2.username,
    role: user2.role,
    image: user2.image || undefined,
  });
  user3accessToken = generateAccessToken({
    id: user3.id,
    email: user3.email,
    username: user3.username,
    role: user3.role,
    image: user3.image || undefined,
  });
});

describe("Friend Request API", () => {
  afterAll(async () => {
    await cleanupDatabase();
  });

  describe("Send Friend Request", () => {
    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should fail to send friend request from user1 to user1", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          friendId: user1.id,
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Cannot send friend request to self");
    });

    it("should send friend request from user1 to user2", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          friendId: user2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request sent");
    });

    it("should fail to send friend request from user1 to user2 again", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          friendId: user2.id,
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Pending friend request already exists");
    });

    it("should send friend request from user1 to user3", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          friendId: user3.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request sent");
    });
  });

  describe("Accept Friend Request", () => {
    let friendRequestFromUser1ToUser2: any;
    beforeAll(async () => {
      friendRequestFromUser1ToUser2 = await prisma.friendRequest.create({
        data: {
          senderId: user1.id,
          receiverId: user2.id,
          status: "PENDING",
        },
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should accept friend request from user2 to user1", async () => {
      const response = await request(app)
        .patch("/api/users/friends/request/accept")
        .set("Authorization", `Bearer ${user2accessToken}`)
        .send({
          requestId: friendRequestFromUser1ToUser2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request accepted");
    });
  });

  describe("Reject Friend Request", () => {
    let friendRequestFromUser1ToUser2: any;
    beforeAll(async () => {
      friendRequestFromUser1ToUser2 = await prisma.friendRequest.create({
        data: {
          senderId: user1.id,
          receiverId: user2.id,
          status: "PENDING",
        },
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should reject friend request from user2 to user1", async () => {
      const response = await request(app)
        .patch("/api/users/friends/request/reject")
        .set("Authorization", `Bearer ${user2accessToken}`)
        .send({
          requestId: friendRequestFromUser1ToUser2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request rejected");
    });
  });

  describe("Cancel Friend Request", () => {
    let friendRequestFromUser1ToUser2: any;
    beforeAll(async () => {
      friendRequestFromUser1ToUser2 = await prisma.friendRequest.create({
        data: {
          senderId: user1.id,
          receiverId: user2.id,
          status: "PENDING",
        },
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should cancel friend request from user1 to user2", async () => {
      const response = await request(app)
        .delete("/api/users/friends/request/cancel")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          requestId: friendRequestFromUser1ToUser2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend request cancelled");
    });

    it("should fail to cancel non-existent friend request", async () => {
      const response = await request(app)
        .delete("/api/users/friends/request/cancel")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          requestId: 100,
        });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error cancelling friend request");
    });
  });

  describe("Get Friend Requests", () => {
    beforeAll(async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            senderId: user1.id,
            receiverId: user2.id,
            status: "PENDING",
          },
          {
            senderId: user1.id,
            receiverId: user2.id,
            status: "REJECTED",
          },
          {
            senderId: user2.id,
            receiverId: user3.id,
            status: "ACCEPTED",
          },
          {
            senderId: user3.id,
            receiverId: user1.id,
            status: "PENDING",
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should get friend requests for user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(2);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(2);
    });

    it("should get PENDING friend requests for user2", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?status=PENDING")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.friendRequests.length).toBe(2);
    });

    it("should get ACCEPTED friend requests for user2", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?status=ACCEPTED")
        .set("Authorization", `Bearer ${user2accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);
    });

    it("should get REJECTED friend requests for user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?status=REJECTED")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);
    });
  });

  describe("Get Friend Requests Sent", () => {
    beforeAll(async () => {
      const friendRequestFromUser1 = await prisma.friendRequest.createMany({
        data: [
          {
            senderId: user1.id,
            receiverId: user2.id,
            status: "ACCEPTED",
          },
          {
            senderId: user1.id,
            receiverId: user3.id,
            status: "REJECTED",
          },
          {
            senderId: user1.id,
            receiverId: user3.id,
            status: "PENDING",
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should get PENDING friend requests sent by user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?type=SENT&status=PENDING")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);

      expect(response.body.friendRequests[0].senderId).toBe(user1.id);
      expect(response.body.friendRequests[0].receiverId).toBe(user3.id);
      expect(response.body.friendRequests[0].status).toBe("PENDING");
    });

    it("should get ACCEPTED friend requests sent by user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?type=SENT&status=ACCEPTED")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);

      expect(response.body.friendRequests[0].senderId).toBe(user1.id);
      expect(response.body.friendRequests[0].receiverId).toBe(user2.id);
      expect(response.body.friendRequests[0].status).toBe("ACCEPTED");
    });

    it("should get REJECTED friend requests sent by user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?type=SENT&status=REJECTED")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);

      expect(response.body.friendRequests[0].senderId).toBe(user1.id);
      expect(response.body.friendRequests[0].receiverId).toBe(user3.id);
      expect(response.body.friendRequests[0].status).toBe("REJECTED");
    });
  });

  describe("Get Friend Requests Received", () => {
    beforeAll(async () => {
      const friendRequestFromUser1ToUser2 =
        await prisma.friendRequest.createMany({
          data: [
            {
              senderId: user1.id,
              receiverId: user2.id,
              status: "ACCEPTED",
            },
            {
              senderId: user1.id,
              receiverId: user3.id,
              status: "REJECTED",
            },
          ],
        });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should get friend requests received by user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?type=RECEIVED")
        .set("Authorization", `Bearer ${user1accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(0);
      expect(response.body.pagination.totalItems).toBe(0);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(0);
    });

    it("should get accepted friend requests received by user2", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?type=RECEIVED&status=ACCEPTED")
        .set("Authorization", `Bearer ${user2accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);

      expect(response.body.friendRequests[0].senderId).toBe(user1.id);
      expect(response.body.friendRequests[0].receiverId).toBe(user2.id);
      expect(response.body.friendRequests[0].status).toBe("ACCEPTED");
    });

    it("should get rejected friend requests received by user3", async () => {
      const response = await request(app)
        .get("/api/users/friends/request?type=RECEIVED&status=REJECTED")
        .set("Authorization", `Bearer ${user3accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(1);
      expect(response.body.pagination.totalItems).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(10);
      expect(response.body.friendRequests.length).toBe(1);

      expect(response.body.friendRequests[0].senderId).toBe(user1.id);
      expect(response.body.friendRequests[0].receiverId).toBe(user3.id);
      expect(response.body.friendRequests[0].status).toBe("REJECTED");
    });
  });

  describe("Other Failed Friend Requests", () => {
    beforeAll(async () => {
      const updateUser1toHaveFriendUser2 = await prisma.user.update({
        where: {
          id: user1.id,
        },
        data: {
          friends: {
            connect: {
              id: user2.id,
            },
          },
        },
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should fail to send friend request to existing friend", async () => {
      const response = await request(app)
        .post("/api/users/friends/request")
        .set("Authorization", `Bearer ${user1accessToken}`)
        .send({
          friendId: user2.id,
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "You are already friends with this user"
      );
    });
  });

  describe("Get Friend Request Count", () => {
    beforeAll(async () => {
      await prisma.friendRequest.createMany({
        data: [
          {
            senderId: user1.id,
            receiverId: user2.id,
            status: "PENDING",
          },
          {
            senderId: user3.id,
            receiverId: user1.id,
            status: "PENDING",
          },
          {
            senderId: user2.id,
            receiverId: user1.id,
            status: "REJECTED",
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.friendRequest.deleteMany();
    });

    it("should get PENDING friend request count for user1", async () => {
      const response = await request(app)
        .get("/api/users/friends/request/count")
        .set("Authorization", `Bearer ${user1accessToken}`);
      const count = await prisma.friendRequest.count();
      console.log("Count:", count);
      expect(response.status).toBe(200);
      expect(response.body.sentCount).toBe(1);
      expect(response.body.receivedCount).toBe(1);
    });
  });
});
