import { type UserDocument } from "../../models/User.js";

export interface UserServiceInterface {
  register(data: UserDocument): Promise<UserDocument>;
  verifyEmailOtp(data: { email: string; otp: string }): Promise<{ message: string }>;
  verifyEmailLink(token: string): Promise<{ message: string }>;
}
