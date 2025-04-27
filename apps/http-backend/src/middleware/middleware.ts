import { json, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
}
export function middleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] ?? "";

  console.log("Request object from middleware", req);

  try {
    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload;
    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(403).json({ error: "Unauthorized" });
  }
}
