import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { generateRefreshToken } from "../utils/jwt";
import { cleanupDatabase } from "../../test/cleanup";

interface User {
  id?: number;
  role?: string;
  name?: string;
  username?: string;
  email: string;
  password: string;
}

interface Tokens {
  access: string | null;
  refresh: string | null;
}

beforeAll(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
});

describe("Auth API", () => {
  let user: User = {
    email: "john.doe@example.com",
    password: "pass1234",
  };
  let user2: User = {
    email: "jane.doe@example.com",
    password: "pass1234",
  };
  let user3: User = {
    email: "jack.doe@example.com",
    password: "pass1234",
  };
  let tokens: Tokens = {
    access: null,
    refresh: null,
  };

  describe("Signup", () => {
    it("should signup a new user", async () => {
      const response = await request(app).post("/api/auth/signup").send(user);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created");
    });

    it("should return 400 if user already exists", async () => {
      const response = await request(app).post("/api/auth/signup").send(user);
      expect(response.status).toBe(400);
      expect(response.body.errors.email).toBe(
        "User already exists with this email"
      );
    });

    it("should return 400 if password is less than 8 characters", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          ...user2,
          password: "pass123",
        });
      expect(response.status).toBe(400);
      expect(response.body.errors.password).toBe(
        "Password must be at least 8 characters long"
      );
    });
  });

  describe("Login", () => {
    it("should login a user", async () => {
      const response = await request(app).post("/api/auth/login").send(user);
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe("string");
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain("refreshToken");

      tokens.access = response.body.accessToken;
      tokens.refresh = response.headers["set-cookie"][0];
    });

    it("should return 404 if user does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send(user3);
      expect(response.status).toBe(404);
      expect(response.body.errors.email).toBe("No user exists with this email");
    });
  });

  describe("Refresh Token", () => {
    it("should refresh access token", async () => {
      const response = await request(app)
        .post("/api/auth/token")
        .set("Cookie", tokens.refresh!);
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe("string");
    });

    it("should return 401 if refresh token is missing", async () => {
      const response = await request(app).post("/api/auth/token");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Refresh Token not provided");
    });

    it("should return 403 if refresh token is invalid", async () => {
      const response = await request(app)
        .post("/api/auth/token")
        .set("Cookie", `refreshToken=invalidRefreshToken`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Invalid Refresh Token");
    });

    it("should return 404 not found if user does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/token")
        .set("Cookie", `refreshToken=${generateRefreshToken({ id: 100 })}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("Logout", () => {
    it("should log out a user", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", tokens.refresh!);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out");
      expect(response.headers["set-cookie"][0].split("=")[1]).toBe("; Path");
    });
  });
});
