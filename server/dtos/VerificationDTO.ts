export type SendType = "LINK" | "OTP";

export interface VerifyInputDTO {
  type: SendType;
  email?: string;
  otp?: string;
  token?: string;
}
