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

      const user = await this.userService.register(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      if (error.type === "validation") {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: error.message });
    }
  };

  verifyEmailOtp = async (req: Request, res: Response) => {
    try {
      if (this.handleValidation(req, res)) return;

      const response = await this.userService.verifyEmailOtp(req.body);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error.type === "validation") {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: error.message });
    }
  };

  verifyEmailLink = async (req: Request, res: Response) => {
    try {
      if (this.handleValidation(req, res)) return;

      const response = await this.userService.verifyEmailLink(req.body);
      return res.status(200).json(response);
    } catch (error: any) {
      if (error.type === "validation") {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: error.message });
    }
  };
}
