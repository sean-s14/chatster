import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface User {
  id: number | string;
  googleId: string | null;
  name: string | null;
  username: string;
  email: string;
  password: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AccessTokenInput {
  id: number | string;
  email: string;
  username: string;
  name?: string;
  image?: string;
  role: string;
}

interface AccessTokenPayload extends AccessTokenInput, JwtPayload {}

type RefreshTokenInput = {
  id: number;
};

interface RefreshTokenPayload extends RefreshTokenInput, JwtPayload {}

interface RequestWithUser extends Request {
  user: AccessTokenPayload;
}

export {
  User,
  AccessTokenInput,
  AccessTokenPayload,
  RefreshTokenInput,
  RefreshTokenPayload,
  RequestWithUser,
};
