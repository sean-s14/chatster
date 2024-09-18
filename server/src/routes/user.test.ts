import { afterAll, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";
import { generateAccessToken } from "../utils/jwt";
import { AccessTokenPayload } from "../types/user";

afterAll(async () => {
  await prisma.user.deleteMany();
});

describe("User API", () => {
  let user: {
    id?: number;
    role?: string;
    name?: string;
    username?: string;
    email: string;
    password: string;
  } = {
    email: "john.doe@example.com",
    password: "pass123",
  };
  let accessToken: string;

  it("should create a new user", async () => {
    const response = await request(app).post("/api/users").send(user);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(user.email);
    expect(response.body.role).toBe("basic");
    expect(response.body.username).not.toBeUndefined();
    expect(response.body.id).not.toBeUndefined();
    user.id = response.body.id;
    user.username = response.body.username;
    user.role = response.body.role;

    // Check that the user was created in the database
    const userDB = await prisma.user.findUnique({ where: { id: user.id } });
    expect(userDB).not.toBeNull();
    expect(userDB?.username).toBe(user.username);
    expect(userDB?.email).toBe(user.email);
    expect(userDB?.role).toBe(user.role);

    accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    } as AccessTokenPayload);
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("should fail to retrieve user by ID without authentication", async () => {
    const response = await request(app).get(`/api/users/${user.id}`);
    expect(response.status).toBe(401);
  });

  it("should get a user by ID", async () => {
    const response = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user.id);
    expect(response.body.username).toBe(user.username);
    expect(response.body.email).toBe(user.email);
    expect(response.body.role).toBe(user.role);
  });

  it("should fail to update a user without authentication", async () => {
    const updatedUser = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    };
    const response = await request(app)
      .patch(`/api/users/${user.id}`)
      .send(updatedUser);

    expect(response.status).toBe(401);
  });

  it("should update a user", async () => {
    const updatedUser = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    };
    const response = await request(app)
      .patch(`/api/users/${user.id}`)
      .send(updatedUser)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedUser.name);
    expect(response.body.email).toBe(updatedUser.email);

    user.name = updatedUser.name;
    user.email = updatedUser.email;
  });

  it("should fail to delete a user without authentication", async () => {
    const response = await request(app).delete(`/api/users/${user.id}`);
    expect(response.status).toBe(401);
  });

  it("should delete a user", async () => {
    const response = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const getUserResponse = await request(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(getUserResponse.status).toBe(404);
  });
});
