import { type UserDocument } from "../../models/User.js"

export interface UserServiceInterface {
  register(data: Partial<UserDocument>): Promise<UserDocument>;
}
