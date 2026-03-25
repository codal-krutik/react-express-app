import type { AuthService } from "../services/AuthService.js";
import type { Request, Response } from "express";
import type { AuthRequest } from "../dtos/AuthDTO.js";
import { validationResult } from "express-validator";

export class AuthController {
  constructor(private authService: AuthService) {}

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };
  }

  authenticate = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const user = await this.authService.authenticate(userId);

      return res.status(200).json({
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { user, token } = await this.authService.login(req.body);

      res.cookie("token", token, {
        ...this.getCookieOptions(),
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: user,
        message: "Logged in successfully",
      });
    } catch (error: any) {
      if (error.type === "validation") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("token", this.getCookieOptions());

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}
