import type { LoginDTO, LoginResponseDTO } from "../dtos/AuthDTO.js";
import type { AuthServiceInterface } from "../interfaces/service/AuthServiceInterface.js";
import type { UserDocument } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { sign } from "../utils/jwt.js";
import type { VerificationService } from "./VerificationService.js";

export class AuthService implements AuthServiceInterface {
  constructor(
    private userRepository: UserRepository,
    private verificationService: VerificationService,
  ) {}

  async authenticate(userId: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

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

      await this.verificationService.send(user.email, "LINK");

      const { password, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err: any) {
      throw err;
    }
  }

  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    try {
      const { emailOrUsername, password } = data;

      const user = await this.userRepository.findByEmailOrUsername(emailOrUsername);

      if (!user) {
        throw {
          type: "validation",
          errors: [{ msg: "Invalid credentials", path: "emailOrUsername" }],
        };
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw {
          type: "validation",
          errors: [{ msg: "Invalid credentials", path: "password" }],
        };
      }

      const payload = {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      };

      const token = sign(payload);

      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}
