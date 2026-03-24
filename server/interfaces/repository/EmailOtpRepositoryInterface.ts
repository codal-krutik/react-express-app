import type mongoose from "mongoose";
import { type EmailOtpDocument } from "../../models/EmailOtp.js";

export interface CreateEmailOtpInput {
  userId: mongoose.Types.ObjectId;
  email: string;
  otpHash: string;
  expiresAt: Date;
}

export interface EmailOtpRepositoryInterface {
  create(data: CreateEmailOtpInput): Promise<EmailOtpDocument>;
  findActiveByUserIdAndEmail(userId: mongoose.Types.ObjectId, email: string): Promise<EmailOtpDocument | null>;
  markUsedById(id: string): Promise<void>;
}