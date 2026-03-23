import { Router } from 'express';
import AuthRoutes from "./AuthRoutes.js";
import UserRotues from "./UserRoutes.js";
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/user', UserRotues);

export default router;
