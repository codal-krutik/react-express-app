import { body } from "express-validator";

export const sendValidator = [
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),

  body("type").isIn(["LINK", "OTP"]).withMessage("Type must be LINK or OTP"),
];

export const verifyValidator = [
  body("type").isIn(["LINK", "OTP"]).withMessage("Type must be LINK or OTP"),

  body("email").if(body("type").equals("OTP")).isEmail().withMessage("Valid email required for OTP").normalizeEmail(),

  body("otp").if(body("type").equals("OTP")).isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),

  body("token").if(body("type").equals("LINK")).isString().isLength({ min: 10 }).withMessage("Valid token required"),
];
