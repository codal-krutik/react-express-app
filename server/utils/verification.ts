import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const LINK_EXPIRY_HOURS = 24;
const TOKEN_BYTE_LENGTH = 32;

/**
 * Generate cryptographically secure numeric OTP
 */
export function generateOtp(length: number = OTP_LENGTH): string {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }

  return otp;
}

/**
 * Generate secure random token (for link-based verification)
 */
export function generateToken(
  byteLength: number = TOKEN_BYTE_LENGTH
): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Hash any sensitive value (OTP / token)
 */
export function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
 * Calculate expiry date in minutes
 */
export function getExpiryInMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Calculate expiry date in hours
 */
export function getExpiryInHours(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/**
 * OTP verification payload generator
 */
export function createOtpPayload() {
  const otp = generateOtp();
  const otpHash = hashValue(otp);

  return {
    otp,
    otpHash,
    expiresAt: getExpiryInMinutes(OTP_EXPIRY_MINUTES),
    type: "OTP" as const,
  };
}

/**
 * Link verification payload generator
 */
export function createLinkPayload() {
  const token = generateToken();
  const tokenHash = hashValue(token);

  return {
    token, // send in email link
    tokenHash, // store in DB
    expiresAt: getExpiryInHours(LINK_EXPIRY_HOURS),
    type: "LINK" as const,
  };
}