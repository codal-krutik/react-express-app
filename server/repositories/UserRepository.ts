import type { UserRepositoryInterface } from "../interfaces/repository/UserRepositoryInterface.js";
import { User, type UserDocument } from "../models/User.js";

export class UserRepository implements UserRepositoryInterface {
  async create(user: Partial<UserDocument>): Promise<UserDocument> {
    return User.create(user);
  }
}
