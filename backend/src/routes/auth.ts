import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register); // POST /auth/register
router.post('/login', login);       // POST /auth/login

export default router;
