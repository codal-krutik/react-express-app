import { Router } from "express";
import { VerificationController } from "../controllers/VerificationController.js";
import { VerificationService } from "../services/VerificationService.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { EmailVerificationRepository } from "../repositories/EmailVerificationRepository.js";
import { sendValidator, verifyValidator } from "../validators/verificationValidators.js";

const router = Router();

const userRepository = new UserRepository();
const emailVerificationRepository = new EmailVerificationRepository();

const verificationService = new VerificationService(userRepository, emailVerificationRepository);

const verificationController = new VerificationController(verificationService);

router.post("/send", sendValidator, verificationController.send);
router.post("/verify", verifyValidator, verificationController.verify);

export default router;
