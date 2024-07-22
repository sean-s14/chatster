import request from "supertest";
import app from "../src/app";
import prisma from "../src/prismaClient";

afterAll(async () => {
  // Clean up the user table after tests
  await prisma.user.deleteMany();
});

describe("User API", () => {
  let userId: number;

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "John Doe", email: "john.doe@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("John Doe");
    expect(response.body.email).toBe("john.doe@example.com");
    userId = response.body.id;
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("should get a user by ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
  });

  it("should update a user", async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send({ name: "Jane Doe", email: "jane.doe@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Jane Doe");
    expect(response.body.email).toBe("jane.doe@example.com");
  });

  it("should delete a user", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);

    const getUserResponse = await request(app).get(`/api/users/${userId}`);
    expect(getUserResponse.status).toBe(404);
  });
});
