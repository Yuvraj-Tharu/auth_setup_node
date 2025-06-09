import express from 'express';
import passport from 'passport';
import AuthService from 'user/service/auth_service';

const router = express.Router();

// Initialize passport and session
router.use(passport.initialize());
router.use(passport.session());

// Google authentication route
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google callback route
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req: any, res: any) => {
//     if (req.user) {
//       const { user, tokens } = req.user;
//       res.status(200).json({
//         message: 'Google login successful',
//         user,
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken,
//       });
//     } else {
//       res.status(401).json({ message: 'Authentication failed' });
//     }
//   },
// );

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req: any, res: any) => {
    if (req.user) {
      const tokens = await AuthService.generateTokens(req.user);
      res.status(200).json({
        message: 'Google login successful',
        user: req.user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  },
);

export default router;
