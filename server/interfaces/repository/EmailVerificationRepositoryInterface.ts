import type mongoose from "mongoose";
import type { EmailVerificationDocument } from "../../models/EmailVerification.js";

export type VerificationType = "OTP" | "LINK";

export interface CreateEmailVerificationInput {
  userId: mongoose.Types.ObjectId;
  email: string;
  type: VerificationType;
  otpHash?: string;
  tokenHash?: string;
  expiresAt: Date;
}

export interface EmailVerificationRepositoryInterface {
  create(data: CreateEmailVerificationInput): Promise<EmailVerificationDocument>;
  findActiveByUserIdAndEmail(
    userId: mongoose.Types.ObjectId,
    email: string,
    type: VerificationType,
  ): Promise<EmailVerificationDocument | null>;
  findActiveByTokenHash(tokenHash: string): Promise<EmailVerificationDocument | null>;
  markUsedById(id: string): Promise<void>;
  invalidatePrevious(userId: mongoose.Types.ObjectId, email: string): Promise<void>;
}
