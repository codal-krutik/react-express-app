import mongoose, { Document, Model } from "mongoose";

export type VerificationType = "OTP" | "LINK";

export interface EmailVerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  type: VerificationType;
  otpHash?: string;
  tokenHash?: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const emailVerificationSchema = new mongoose.Schema<EmailVerificationDocument>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["OTP", "LINK"],
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      select: false,
    },
    tokenHash: {
      type: String,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const EmailVerification: Model<EmailVerificationDocument> =
  mongoose.models.EmailVerification ||
  mongoose.model<EmailVerificationDocument>("EmailVerification", emailVerificationSchema);
