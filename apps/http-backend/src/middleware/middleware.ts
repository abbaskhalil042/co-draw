import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export interface AuthRequest extends Request {
  userId?: string;
}

export function middleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers['token'] as string;

  console.log("Token from middleware:", token);

  if (!token) {
    res.status(401).json({ error: "Token missing" }); // ❌ Don't return
    return; // ✅ just stop here
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded && typeof decoded === 'object') {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(403).json({ error: "Unauthorized" });
  }
}
