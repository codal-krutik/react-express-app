import { type UserDocument } from "../../models/User.js"
import { type Filter } from "mongodb";

export interface UserRepositoryInterface {
  create(user: Partial<UserDocument>): Promise<UserDocument>;
}
