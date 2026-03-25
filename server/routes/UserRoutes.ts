import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { UserService } from "../services/UserService.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { body, query } from "express-validator";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";

const router = Router();

const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerificationRepository();
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

export default router;
