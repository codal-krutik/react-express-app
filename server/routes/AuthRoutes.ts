import { Router } from "express";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { VerificationService } from "../services/VerificationService.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerificationRepository();

const verificationService = new VerificationService(userRepository, emailVerificationRepository);
const authService = new AuthService(userRepository, verificationService);

const authController = new AuthController(authService);

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/logout", authController.logout);

export default router;
