import type { VerificationServiceInterface } from "../interfaces/service/VerificationServiceInterface.js";
import type { Request, Response } from "express";

export class VerificationController {
  constructor(private verificationService: VerificationServiceInterface) {}

  send = async (req: Request, res: Response) => {
    try {
      const { email, type } = req.body;

      const data = await this.verificationService.send(email, type);

      res.json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  verify = async (req: Request, res: Response) => {
    try {
      const { type, email, otp, token } = req.body;
      const data = await this.verificationService.verify({
        type,
        email,
        otp,
        token,
      });

      res.json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}
