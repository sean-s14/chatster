import { Response } from "express";
import jwt from "jsonwebtoken";
import {
  AccessTokenInput,
  AccessTokenPayload,
  RefreshTokenInput,
  RefreshTokenPayload,
} from "../types/user";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

function generateAccessToken(user: AccessTokenInput) {
  return jwt.sign(user, JWT_SECRET_KEY, { expiresIn: "15m" });
}

function generateRefreshToken(user: RefreshTokenInput) {
  return jwt.sign(user, JWT_SECRET_KEY, { expiresIn: "7d" });
}

function addRefreshTokenToCookie(user: RefreshTokenPayload, res: Response) {
  const refreshToken = generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + ONE_WEEK_IN_MS),
    maxAge: ONE_WEEK_IN_MS,
  });
  return res;
}

function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  addRefreshTokenToCookie,
};
