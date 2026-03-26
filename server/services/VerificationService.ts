import { UserRepository } from "../repositories/UserRepository.js";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { createLinkPayload, createOtpPayload, hashValue } from "../utils/verification.js";
import { transporter } from "../utils/transport.js";
import type { VerificationServiceInterface } from "../interfaces/service/VerificationServiceInterface.js";
import type { UserDocument } from "../models/User.js";
import type { SendType } from "../dtos/VerificationDTO.js";

export class VerificationService implements VerificationServiceInterface {
  constructor(
    private userRepository: UserRepository,
    private emailVerificationRepository: EmailVerificationRepository,
  ) {}

  private async sendEmail(user: UserDocument, token: string, type: SendType): Promise<void> {
    const from = process.env.MAIL_FROM ?? "no-reply@local.dev";

    if (type === "LINK") {
      const ttl = process.env.EMAIL_VERIFICATION_EXPIRES_IN ?? "10";

      const link = `${process.env.FRONTEND_URL}/account/verify?token=${token}`;

      await transporter.sendMail({
        from,
        to: user.email,
        subject: "Verify your email",
        text: `Click the link: ${link}`,
        html: `
          <p>Click below to verify your email:</p>
          <a href="${link}">${link}</a>
          <p>This link expires in ${ttl} minutes.</p>
        `,
      });
    }

    if (type === "OTP") {
      const ttl = process.env.OTP_EXPIRES_IN ?? "10";

      await transporter.sendMail({
        from,
        to: user.email,
        subject: "Your OTP Code",
        text: `Your OTP is ${token}. It expires in ${ttl} minutes.`,
      });
    }
  }

  async send(email: string, type: SendType): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw {
        type: "validation",
        errors: [{ msg: "User not found", path: "email" }],
      };
    }

    if (user.isEmailVerified) {
      return { message: "Email already verified" };
    }

    await this.emailVerificationRepository.invalidatePrevious(user._id, user.email);

    if (type === "LINK") {
      const { token, tokenHash, expiresAt } = createLinkPayload();

      await this.emailVerificationRepository.create({
        userId: user._id,
        email: user.email,
        type: "LINK",
        tokenHash,
        expiresAt,
      });

      await this.sendEmail(user, token, "LINK");
    } else {
      const { otp, otpHash, expiresAt } = createOtpPayload();

      await this.emailVerificationRepository.create({
        userId: user._id,
        email: user.email,
        type: "OTP",
        otpHash,
        expiresAt,
      });

      await this.sendEmail(user, otp, "OTP");
    }

    return { message: `${type} sent successfully` };
  }

  async verify(data: { type: SendType; email?: string; otp?: string; token?: string }): Promise<{ message: string }> {
    const { type, email, otp, token } = data;

    if (type === "LINK") {
      if (!token) {
        throw {
          type: "validation",
          errors: [{ msg: "Token is required", path: "token" }],
        };
      }

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

    if (!email || !otp) {
      throw {
        type: "validation",
        errors: [{ msg: "Email and OTP are required", path: "otp" }],
      };
    }

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
        errors: [{ msg: "Invalid or expired OTP", path: "otp" }],
      };
    }

    await this.emailVerificationRepository.markUsedById(otpDoc._id.toString());

    await this.userRepository.markEmailVerified(user._id.toString());

    return { message: "Email verified successfully" };
  }
}
