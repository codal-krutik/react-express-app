import type mongoose from "mongoose";
import { EmailOtp, type EmailOtpDocument } from "../models/EmailOtp.js";
import type {
  CreateEmailOtpInput,
  EmailOtpRepositoryInterface,
} from "../interfaces/repository/EmailOtpRepositoryInterface.js";

export class EmailOtpRepository implements EmailOtpRepositoryInterface {
  async create(data: CreateEmailOtpInput): Promise<EmailOtpDocument> {
    return EmailOtp.create(data);
  }

  async findActiveByUserIdAndEmail(
    userId: mongoose.Types.ObjectId,
    email: string
  ): Promise<EmailOtpDocument | null> {
    return EmailOtp.findOne({
      userId,
      email,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    }).select("+otpHash");
  }

  async markUsedById(id: string): Promise<void> {
    await EmailOtp.findByIdAndUpdate(id, { usedAt: new Date() });
  }
}
