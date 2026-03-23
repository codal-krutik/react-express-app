import type { UserServiceInterface } from "../interfaces/service/UserServiceInterface.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { type UserDocument } from "../models/User.js";

export class UserService implements UserServiceInterface {
  constructor(private userRepository: UserRepository) { }

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
      const { password, ...safeUser } = user.toObject();
      return safeUser;
    } catch (err: any) {
      throw err;
    }
  }
}
