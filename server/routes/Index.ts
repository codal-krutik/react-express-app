import { Router } from "express";
import AuthRoutes from "./AuthRoutes.js";
import VerificationRoutes from "./VerificationRoutes.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";
import { AuthController } from "../controllers/AuthController.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { AuthService } from "../services/AuthService.js";
import { VerificationService } from "../services/VerificationService.js";

const router = Router();

const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerificationRepository();

const verificationService = new VerificationService(userRepository, emailVerificationRepository);
const authService = new AuthService(userRepository, verificationService);

const authController = new AuthController(authService);

router.get("/authenticate", authMiddleware, authController.authenticate);

router.use("/auth", AuthRoutes);
router.use("/verification", VerificationRoutes);

export default router;
