import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { UserService } from "../services/UserService.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { body, query } from "express-validator";
import { EmailVerification } from "../models/EmailVerification.js";

const router = Router();

const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerification();
const userService = new UserService(userRepository, emailVerificationRepository);
const userController = new UserController(userService);

router.post(
  "/register",
  [
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
  ],
  userController.register,
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  userController.verifyEmailOtp,
);

router.get(
  "/verify-email",
  [
    query("token")
      .exists({ checkFalsy: true })
      .withMessage(`Token is required`)
      .bail()
      .isString()
      .withMessage(`Token must be a string`)
      .bail()
      .isLength({ min: 10 })
      .withMessage(`Invalid token`),
  ],
  userController.verifyEmailLink,
);

export default router;
