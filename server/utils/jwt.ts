import type { CustomJwtPayload } from "../dtos/JwtDTO.js";
import type { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 */
export function sign(payload: CustomJwtPayload): string {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as Secret;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as StringValue | number;
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN,
    };

    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    throw error;
  }
}

/**
 * Verify JWT Token
 */
export function verify(token: string): CustomJwtPayload {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as Secret;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }

    return decoded as CustomJwtPayload;
  } catch (error) {
    throw error;
  }
}
