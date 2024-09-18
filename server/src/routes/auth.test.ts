import { afterAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";

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

afterAll(async () => {
  await prisma.user.deleteMany();
});

describe("Auth API", () => {
  let user: User = {
    email: "john.doe@example.com",
    password: "pass1234",
  };
  let tokens: Tokens = {
    access: null,
    refresh: null,
  };

  it("should signup a new user", async () => {
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created");
  });

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

  it("should refresh access token", async () => {
    const response = await request(app)
      .post("/api/auth/token")
      .set("Cookie", tokens.refresh!);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(typeof response.body.accessToken).toBe("string");
  });

  it("should log out a user", async () => {
    console.log(tokens.refresh);
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", tokens.refresh!);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out");
    expect(response.headers["set-cookie"][0].split("=")[1]).toBe("; Path");
  });
});
