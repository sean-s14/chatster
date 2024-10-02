import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { RequestWithUser } from "../types/user";

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken)
    return res.status(401).json({ error: "No access token provided" });

  const user = verifyAccessToken(accessToken);
  if (!user) return res.status(401).json({ error: "Invalid access token" });

  (req as RequestWithUser).user = user;
  next();
}

function authorizeUser(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const request = req as RequestWithUser;

  if (request.user.role === "admin" || request.user.role === "superuser") {
    next();
  } else if (Number(request.user.id) === Number(id)) {
    next();
  } else {
    return res.status(403).json({ error: "Unauthorized" });
  }
}

export { authenticateToken, authorizeUser };
