import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { createUser } from "../../test/create-user";
import { generateAccessToken } from "../utils/jwt";
import { cleanupDatabase } from "../../test/cleanup";

describe("User Friends API", () => {
  const password = "pass1234";
  let user1: any = { email: "user1@example.com" };
  let user2: any = { email: "user2@example.com" };
  let user3: any = { email: "user3@example.com" };

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

  describe("Adding a friend", () => {
    it("should add user2 as friend to user1", async () => {
      const response = await request(app)
        .patch("/api/users/friends")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          friendId: user2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend added successfully");
    });

    it("should add user3 as friend to user1", async () => {
      const response = await request(app)
        .patch("/api/users/friends")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          friendId: user3.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend added successfully");
    });
  });

  describe("Checking if user is friend", () => {
    it("should return true for user1 and user2", async () => {
      const response = await request(app)
        .get(`/api/users/friends/is-friend/${user2.username}`)
        .set("Authorization", `Bearer ${user1.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.isFriend).toBe(true);
    });

    it("should return false for user2 and user3", async () => {
      const response = await request(app)
        .get(`/api/users/friends/is-friend/${user3.username}`)
        .set("Authorization", `Bearer ${user2.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.isFriend).toBe(false);
    });
  });

  describe("Getting all friends", () => {
    it("should get two friends for user1", async () => {
      const response = await request(app)
        .get("/api/users/friends")
        .set("Authorization", `Bearer ${user1.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.friends.length).toBe(2);
      expect(response.body.friends[0].username).toBe(user2.username);
      expect(response.body.friends[0].image).toBeDefined();
      expect(response.body.friends[0].createdAt).toBeDefined();
      expect(response.body.friends[0].updatedAt).toBeDefined();
    });

    it("should get one friend for user1 with pagination", async () => {
      const response = await request(app)
        .get("/api/users/friends?page=1&limit=1")
        .set("Authorization", `Bearer ${user1.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.friends.length).toBe(1);
    });

    it("should get one friend for user2", async () => {
      const response = await request(app)
        .get("/api/users/friends")
        .set("Authorization", `Bearer ${user2.accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.friends.length).toBe(1);
    });
  });

  describe("Removing a friend", () => {
    it("should remove a friend from user1", async () => {
      const response = await request(app)
        .delete("/api/users/friends")
        .set("Authorization", `Bearer ${user1.accessToken}`)
        .send({
          friendId: user2.id,
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe("Friend removed successfully");

      const getAllResponse = await request(app)
        .get("/api/users/friends")
        .set("Authorization", `Bearer ${user1.accessToken}`);
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.friends.length).toBe(1);
    });
  });
});
