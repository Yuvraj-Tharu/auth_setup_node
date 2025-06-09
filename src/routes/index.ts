import { Router } from 'express';
import userRoutes from '../user/routes/user_routes';
import googleLoginRoutes from '../user/routes/google_login_routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/user', googleLoginRoutes);

export default router;
