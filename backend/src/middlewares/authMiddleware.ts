import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
