import type { UserServiceInterface } from "../interfaces/service/UserServiceInterface.js";
import type { UserDocument } from "../models/User.js";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { createLinkPayload, createOtpPayload, hashValue } from "../utils/verification.js";
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

      const { token, tokenHash, expiresAt } = createLinkPayload();

      await this.emailVerificationRepository.invalidatePrevious(user._id, user.email);

      await this.emailVerificationRepository.create({
        userId: user._id,
        email: user.email,
        type: "LINK",
        tokenHash,
        expiresAt,
      });

      await this.sendVerificationEmail(user, token, "LINK");

      const { password, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err: any) {
      throw err;
    }
  }

  private async sendVerificationEmail(user: any, token: string, type: "LINK" | "OTP") {
    const from = process.env.MAIL_FROM ?? "no-reply@local.dev";

    if (type === "LINK") {
      const ttlMinutes = Number(process.env.EMAIL_VERIFICATION_EXPIRES_IN ?? "10");

      const verificationLink = `${process.env.FRONTEND_URL}/account/verify?token=${token}`;

      await transporter.sendMail({
        from,
        to: user.email,
        subject: "Verify your email",
        text: `Click the link: ${verificationLink}`,
        html: `
          <p>Click below to verify your email:</p>
          <a href="${verificationLink}">${verificationLink}</a>
          <p>This link expires in ${ttlMinutes} minutes.</p>
        `,
      });
    }

    if (type === "OTP") {
      const ttlMinutes = Number(process.env.OTP_EXPIRES_IN ?? "10");

      await transporter.sendMail({
        from,
        to: user.email,
        subject: "Your OTP Code",
        text: `Your OTP is ${token}. It expires in ${ttlMinutes} minutes.`,
      });
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

    return { message: "Email verified successfully" };
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

      return { message: "Email verified successfully" };
    } catch (error) {
      throw error;
    }
  }

  async resendVerificationLink(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw {
        type: "validation",
        errors: [{ msg: "User not found", path: "user" }],
      };
    }

    if (user.isEmailVerified) {
      return { message: "Email is already verified" };
    }

    await this.emailVerificationRepository.invalidatePrevious(user._id, user.email);

    const { token, tokenHash, expiresAt } = createLinkPayload();

    await this.emailVerificationRepository.create({
      userId: user._id,
      email: user.email,
      type: "LINK",
      tokenHash,
      expiresAt,
    });

    await this.sendVerificationEmail(user, token, "LINK");

    return { message: "Verification link sent successfully" };
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw {
        type: "validation",
        errors: [{ msg: "User not found", path: "user" }],
      };
    }

    if (user.isEmailVerified) {
      return { message: "Email is already verified" };
    }

    await this.emailVerificationRepository.invalidatePrevious(user._id, user.email);

    const { otp, otpHash, expiresAt } = createOtpPayload();

    await this.emailVerificationRepository.create({
      userId: user._id,
      email: user.email,
      type: "OTP",
      otpHash,
      expiresAt,
    });

    await this.sendVerificationEmail(user, otp, "OTP");

    return { message: "OTP sent successfully" };
  }
}
