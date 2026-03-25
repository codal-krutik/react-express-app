import { type UserDocument } from "../../models/User.js";

export interface UserServiceInterface {
  register(data: UserDocument): Promise<UserDocument>;
  verifyEmailLink(token: string): Promise<{ message: string }>;
  verifyEmailOtp(data: { email: string; otp: string }): Promise<{ message: string }>;
  resendVerificationLink(email: string): Promise<{ message: string }>;
  resendOtp(email: string): Promise<{ message: string }>;
}
