import { customGenerateUsername } from "./auth";
import { afterAll, describe, it, expect } from "@jest/globals";
import prisma from "../prismaClient";

describe("customGenerateUsername", () => {
  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  let _username: string | undefined;

  it("should generate a unique username", async () => {
    const username = await customGenerateUsername();
    expect(username).toBeDefined();
    _username = username;
  });

  it("should return the provided username if it is unique", async () => {
    const testUsername = "test_user14";
    const username = await customGenerateUsername(testUsername);
    expect(username).toBe(testUsername);
  });

  it("should generate a unique username if the provided username is not unique", async () => {
    await prisma.user.create({
      data: {
        username: _username!,
        email: "test@example.com",
      },
    });
    const username = await customGenerateUsername(_username);
    expect(username).toBeDefined();
    expect(username).not.toBe(_username);
  });
});
