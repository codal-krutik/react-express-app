import type mongoose from "mongoose";
import { EmailVerification, type EmailVerificationDocument } from "../models/EmailVerification.js";
import type {
  CreateEmailVerificationInput,
  EmailVerificationRepositoryInterface,
} from "../interfaces/repository/EmailVerificationRepositoryInterface.js";

export class EmailVerificationRepository implements EmailVerificationRepositoryInterface {
  async create(data: CreateEmailVerificationInput): Promise<EmailVerificationDocument> {
    return EmailVerification.create(data);
  }

  async findActiveByUserIdAndEmail(
    userId: mongoose.Types.ObjectId,
    email: string,
    type: "OTP" | "LINK",
  ): Promise<EmailVerificationDocument | null> {
    const query = EmailVerification.findOne({
      userId,
      email,
      type,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (type === "OTP") {
      query.select("+otpHash");
    } else {
      query.select("+tokenHash");
    }

    return query;
  }

  async findActiveByTokenHash(tokenHash: string): Promise<EmailVerificationDocument | null> {
    return EmailVerification.findOne({
      tokenHash,
      type: "LINK",
      usedAt: null,
      expiresAt: { $gt: new Date() },
    }).select("+tokenHash");
  }

  async markUsedById(id: string): Promise<void> {
    await EmailVerification.findByIdAndUpdate(id, {
      usedAt: new Date(),
    });
  }

  async invalidatePrevious(userId: mongoose.Types.ObjectId, email: string): Promise<void> {
    await EmailVerification.updateMany(
      {
        userId,
        email,
        usedAt: null,
      },
      {
        usedAt: new Date(),
      },
    );
  }
}
