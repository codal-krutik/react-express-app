import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Please provide a valid email address").normalizeEmail(),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidator = [
  body("emailOrUsername")
    .trim()
    .notEmpty()
    .withMessage("Email or Username is required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 characters"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
