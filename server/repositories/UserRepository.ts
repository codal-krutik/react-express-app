import type { UserRepositoryInterface } from "../interfaces/repository/UserRepositoryInterface.js";
import { User, type UserDocument } from "../models/User.js";

export class UserRepository implements UserRepositoryInterface {
  async findById(id: string): Promise<UserDocument | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return await User.findOne({ username });
  }

  async findByEmailOrUsername(identifier: string): Promise<UserDocument | null> {
    return await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    }).select("+password");
  }

  async create(user: UserDocument): Promise<UserDocument> {
    return User.create(user);
  }
}
