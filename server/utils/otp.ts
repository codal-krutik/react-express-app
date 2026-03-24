import crypto from "crypto";

export function generateNumricOtp(Length = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < Length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)]
  }
  return otp;
}

export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
