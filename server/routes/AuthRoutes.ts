import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";
import { body, query } from "express-validator";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";

const router = Router();

const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerificationRepository();

const authService = new AuthService(userRepository);
const userService = new UserService(userRepository, emailVerificationRepository);

const authController = new AuthController(authService);
const userController = new UserController(userService);

router.post(
  "/login",
  [
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
  ],
  authController.login,
);

router.post("/logout", authController.logout);

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
  "/verify-email-link",
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

router.post(
  "/resend-verification-link",
  [body("email").isEmail().withMessage("Please provide a valid email address").normalizeEmail()],
  userController.resendVerificationLink,
);

router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Please provide a valid email address").normalizeEmail()],
  userController.resendOtp,
);

export default router;
