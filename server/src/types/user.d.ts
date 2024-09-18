import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

interface User {
  id: number | string;
  googleId: string | null;
  name: string | null;
  email: string;
  password: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AccessTokenPayload extends JwtPayload {
  id: number | string;
  email: string;
  username: string;
  name?: string;
  image?: string;
  role: string;
}

interface RefreshTokenPayload extends JwtPayload {
  id: number;
}

export { User, AccessTokenPayload, RefreshTokenPayload };
