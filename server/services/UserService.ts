import type { UserServiceInterface } from "../interfaces/service/UserServiceInterface.js";
import type { UserDocument } from "../models/User.js";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { createOtpPayload, createLinkPayload, hashValue } from "../utils/verification.js";
import { transporter } from "../utils/transport.js";

export class UserService implements UserServiceInterface {
  constructor(
    private userRepository: UserRepository,
    private emailVerificationRepository: EmailVerificationRepository,
  ) {}

  async register(data: UserDocument): Promise<UserDocument> {
    try {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw {
          type: "validation",
          errors: [{ msg: "Email already exists", path: "email" }],
        };
      }

      const existingUsername = await this.userRepository.findByUsername(data.username);
      if (existingUsername) {
        throw {
          type: "validation",
          errors: [{ msg: "Username already exists", path: "username" }],
        };
      }

      const user = await this.userRepository.create(data);

      const { otp, otpHash, expiresAt } = createOtpPayload();
      const ttlMinutes = Number(process.env.OTP_EXPIRES_IN ?? "10");

      await this.emailVerificationRepository.invalidatePrevious(user._id, user.email);

      await this.emailVerificationRepository.create({
        userId: user._id,
        email: user.email,
        type: "OTP",
        otpHash,
        expiresAt,
      });

      const from = process.env.MAIL_FROM ?? "no-replay@local.dev";
      await transporter.sendMail({
        from,
        to: user.email,
        subject: "Verify your email",
        text: `Your verification code is ${otp}. It expires in ${ttlMinutes} minutes`,
      });

      const { password, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err: any) {
      throw err;
    }
  }

  async verifyEmailOtp(data: { email: string; otp: string }): Promise<{ message: string }> {
    try {
      const email = data.email.toLowerCase().trim();
      const otp = data.otp.trim();

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw {
          type: "validation",
          errors: [{ msg: "User not found", path: "email" }],
        };
      }

      const otpDoc = await this.emailVerificationRepository.findActiveByUserIdAndEmail(user._id, email, "OTP");

      if (!otpDoc || otpDoc.otpHash !== hashValue(otp)) {
        throw {
          type: "validation",
          errors: [{ msg: "OTP is invalid or expired", path: "otp" }],
        };
      }

      await this.emailVerificationRepository.markUsedById(otpDoc._id.toString());

      await this.userRepository.markEmailVerified(user._id.toString());

      return { message: "Email verified successfully via OTP" };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmailLink(token: string): Promise<{ message: string }> {
    const tokenHash = hashValue(token);

    const record = await this.emailVerificationRepository.findActiveByTokenHash(tokenHash);

    if (!record) {
      throw {
        type: "validation",
        errors: [{ msg: "Invalid or expired link", path: "token" }],
      };
    }

    await this.emailVerificationRepository.markUsedById(record._id.toString());

    await this.userRepository.markEmailVerified(record.userId.toString());

    return { message: "Email verified successfully via link" };
  }
}
