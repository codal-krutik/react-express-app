import { Router } from "express";
import AuthRoutes from "./AuthRoutes.js";
import UserRotues from "./UserRoutes.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";
import { AuthController } from "../controllers/AuthController.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.get("/authenticate", authMiddleware, authController.authenticate);

router.use("/auth", AuthRoutes);
router.use("/user", UserRotues);

export default router;
