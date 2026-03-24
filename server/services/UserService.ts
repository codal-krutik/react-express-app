import type { UserServiceInterface } from "../interfaces/service/UserServiceInterface.js";
import type { UserDocument } from "../models/User.js";
import type { EmailOtpRepository } from "../repositories/EmailOtpRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { generateNumricOtp, hashOtp } from "../utils/otp.js";
import { transporter } from "../utils/transport.js";

export class UserService implements UserServiceInterface {
  constructor(
    private userRepository: UserRepository,
    private emailOtpRepository: EmailOtpRepository
  ) { }

  async register(data: UserDocument): Promise<UserDocument> {
    try {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw {
          type: "validation",
          errors: [{ msg: "Email already exists", path: "email" }]
        };
      }

      const existingUsername = await this.userRepository.findByUsername(data.username);
      if (existingUsername) {
        throw {
          type: "validation",
          errors: [{ msg: "Username already exists", path: "username" }]
        };
      }

      const user = await this.userRepository.create(data);

      const otp = generateNumricOtp(6);
      const otpHash = hashOtp(otp);
      const ttlMinutes = Number(process.env.OTP_EXPIRES_IN ?? "10");
      const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);

      await this.emailOtpRepository.create({
        userId: user._id,
        email: user.email,
        otpHash,
        expiresAt,
      });

      const from = process.env.MAIL_FROM ?? "no-replay@local.dev";
      await transporter.sendMail({
        from,
        to: user.email,
        subject: "Verify your email",
        text: `Your verification code is ${otp}. It expires in ${ttlMinutes} minutes`,
      })

      const { password, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err: any) {
      throw err;
    }
  }

  async verifyEmailOtp(data: { email: string; otp: string; }): Promise<{ message: string; }> {
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

      const otpDoc = await this.emailOtpRepository.findActiveByUserIdAndEmail(user._id, email);

      if (!otpDoc) {
        throw {
          type: "validation",
          errors: [{ msg: "OTP is invalid or expired", path: "otp" }],
        };
      }

      if (otpDoc.otpHash !== hashOtp(otp)) {
        throw {
          type: "validation",
          errors: [{ msg: "OTP is invalid or expired", path: "otp" }],
        };
      }

      await this.emailOtpRepository.markUsedById(otpDoc._id.toString());

      await this.userRepository.markEmailVerified(user._id.toString());

      return { message: "Email verified successfully" };
    } catch (error) {
      throw error;
    }
  }
}
