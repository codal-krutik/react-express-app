import mongoose, { Document, Model } from "mongoose";

export interface EmailOtpDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  otpHash: string;
  expiresAt: Date;
  usedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const emailOtpSchema = new mongoose.Schema<EmailOtpDocument>(
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
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const EmailOtp: Model<EmailOtpDocument> = mongoose.models.EmailOtp || mongoose.model<EmailOtpDocument>("EmailOtp", emailOtpSchema);
