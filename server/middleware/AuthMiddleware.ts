import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../dtos/AuthDTO.js";
import { verify } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = verify(token);
    req.user = decoded;

    next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({
        message: "Token not active",
        code: "TOKEN_NOT_ACTIVE",
      });
    }

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};
