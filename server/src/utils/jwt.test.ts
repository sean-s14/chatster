import { describe, it, expect } from "@jest/globals";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  // addRefreshTokenToCookie,
} from "./jwt";
import { AccessTokenInput, RefreshTokenInput } from "../types/user";

describe("jwt", () => {
  let _user1: AccessTokenInput = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    role: "user",
  };

  let _user2: RefreshTokenInput = {
    id: 1,
  };

  describe("generateAccessToken", () => {
    it("should generate an access token", () => {
      const token = generateAccessToken(_user1);
      expect(token).toBeDefined();
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token", () => {
      const token = generateRefreshToken(_user2);
      expect(token).toBeDefined();
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify an access token", () => {
      const token = generateAccessToken(_user1);
      const decoded = verifyAccessToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe(_user1.id);
      expect(decoded?.email).toBe(_user1.email);
      expect(decoded?.username).toBe(_user1.username);
      expect(decoded?.role).toBe(_user1.role);
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify a refresh token", () => {
      const token = generateRefreshToken(_user2);
      const decoded = verifyRefreshToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe(_user2.id);
    });
  });

  // TODO: Build a test for addRefreshTokenToCookie
});
