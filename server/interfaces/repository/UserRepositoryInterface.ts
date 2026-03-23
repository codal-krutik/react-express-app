import { type UserDocument } from "../../models/User.js"

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<UserDocument | null>
  findByUsername(username: string): Promise<UserDocument | null>
  findByEmailOrUsername(identifier: string): Promise<UserDocument | null>
  create(user: UserDocument): Promise<UserDocument>;
}
