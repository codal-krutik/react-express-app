import { Router } from 'express';
import { UserRepository } from '../repositories/UserRepository.js';
import { AuthService } from '../services/AuthService.js';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { body } from 'express-validator';

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.get("/authenticate", authMiddleware, authController.authenticate);

router.post('/login', [
  body("emailOrUsername")
    .trim()
    .notEmpty()
    .withMessage("Email or Username is required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 characters"),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], authController.login)

export default router;
