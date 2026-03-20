import type { UserServiceInterface } from "../interfaces/service/UserServiceInterface.js";
import type { UserRepository } from "../repositories/UserRepository.js";
import { User, type UserDocument } from "../models/User.js";

export class UserService implements UserServiceInterface {
  constructor(private userRepository: UserRepository) { }

  async register(data: Partial<UserDocument>): Promise<UserDocument> {
    if (!data.email || !data.password || !data.username) {
      throw new Error("All fields are required");
    }

    const existing = await User.findOne({
      $or: [
        { email: data.email },
        { username: data.username }
      ]
    });

    if (existing) {
      if (existing.email === data.email) {
        throw new Error("Email already exists");
      }
      if (existing.username === data.username) {
        throw new Error("Username already exists");
      }
    }

    try {
      return await this.userRepository.create(data);
    } catch (err: any) {
      throw err;
    }
  }
}