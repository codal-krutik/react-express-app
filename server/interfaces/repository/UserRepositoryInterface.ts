import { type UserDocument } from "../../models/User.js"

export interface UserRepositoryInterface {
  findById(id: string): Promise<UserDocument | null>
  findByEmail(email: string): Promise<UserDocument | null>
  findByUsername(username: string): Promise<UserDocument | null>
  findByEmailOrUsername(identifier: string): Promise<UserDocument | null>
  create(user: UserDocument): Promise<UserDocument>;
  markEmailVerified(userId: string): Promise<UserDocument | null>;
}
