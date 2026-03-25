import type { UserService } from "../services/UserService.js";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";

export class UserController {
  constructor(private userService: UserService) {}

  private handleValidation(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return true;
    }
    return false;
  }

  register = async (req: Request, res: Response) => {
    try {
      if (this.handleValidation(req, res)) return;

      const data = await this.userService.register(req.body);
      return res.status(201).json({
        success: true,
        data,
        message: "User registerd",
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

  verifyEmailOtp = async (req: Request, res: Response) => {
    try {
      if (this.handleValidation(req, res)) return;

      const data = await this.userService.verifyEmailOtp(req.body);
      return res.status(200).json({
        success: true,
        data,
        message: "OTP verified successfully",
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

  verifyEmailLink = async (req: Request, res: Response) => {
    try {
      if (this.handleValidation(req, res)) return;

      const data = await this.userService.verifyEmailLink(req.body);
      return res.status(200).json({
        success: true,
        data,
        message: "Email verified successfully",
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
}
