import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prismaClient";
import { customGenerateUsername } from "../utils/auth";
import {
  verifyRefreshToken,
  addRefreshTokenToCookie,
  generateAccessToken,
} from "../utils/jwt";
import { AccessTokenPayload, AccessTokenInput } from "../types/user";

async function signup(req: Request, res: Response) {
  const { email, password } = req.body;
  let { username } = req.body;

  if (password.length < 8) {
    return res.status(400).json({
      errors: { password: "Password must be at least 8 characters long" },
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: { email: "User already exists with this email" } });
    }

    username = await customGenerateUsername(username);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ success: "User created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// TODO: Enable login with either username OR email
async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return res
        .status(404)
        .json({ errors: { email: "No user exists with this email" } });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password!);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: { password: "Incorrect password" } });
    }

    const accessTokenPayload: AccessTokenInput = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      name: existingUser.name || undefined,
      image: existingUser.image || undefined,
      role: existingUser.role,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    res = addRefreshTokenToCookie({ id: existingUser.id }, res);

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getNewAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return res.status(401).json({ error: "Refresh Token not provided" });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded)
      return res.status(403).json({ error: "Invalid Refresh Token" });

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const accessTokenPayload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name || undefined,
      image: user.image || undefined,
      role: user.role,
    };

    const accessToken = generateAccessToken(accessTokenPayload);

    res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ error: "Failed to refresh token" });
  }
}

async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ success: "Logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export { signup, login, getNewAccessToken, logout };
