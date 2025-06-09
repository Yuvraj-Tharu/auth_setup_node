import { Request, Response } from 'express';
import UserService from '../service/user_service';
import { getMatchAndSortData } from '../../utils/pagination';
import { success, apiError } from '../../utils/response';
import AuthService from 'user/service/auth_service';
import { comparePassword, hashPassword } from '@utils/bcrypt';
import { UserPayload } from '@middleware/auth';
import { verifyRecaptcha, verifyRecaptchaV3 } from '@utils/recaptcha';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { password, ...otherData } = req.body;
      const hashedPassword = await hashPassword(password);
      const userData = { ...otherData, password: hashedPassword };
      const user = await UserService.createUser(userData);
      res.status(201).json(success('User created successfully', 201, user));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to create user', error as any, 500));
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json(await apiError('User not found', {}, 404));
        return;
      }
      res.status(200).json(success('User retrieved successfully', 200, user));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve user', error as any, 500));
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      if (!user) {
        res.status(404).json(await apiError('User not found', {}, 404));
        return;
      }
      res.status(200).json(success('User updated successfully', 200, user));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to update user', error as any, 500));
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.deleteUser(req.params.id);
      if (!user) {
        res.status(404).json(await apiError('User not found', {}, 404));
        return;
      }
      res.status(200).json(success('User deleted successfully', 200, {}));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to delete user', error as any, 500));
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const search = req.query.search;
      if (search) {
        matchData.$or = [{ name: { $regex: search, $options: 'i' } }];
      }
      const users = await UserService.getUsers(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );
      res.status(200).json(success('Users retrieved successfully', 200, users));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to retrieve users', error as any, 500));
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, recaptchaToken } = req.body;
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        res
          .status(400)
          .json(await apiError('Recaptcha verification failed', {}, 400));
        return;
      }

      /* Uncomment the following lines if you want to use reCAPTCHA v3
      *code based on the score
      
            const recaptchaResult = await verifyRecaptchaV3(
              recaptchaToken,
              'login',
              0.5, // Minimum score threshold (0.0-1.0)
            );
            console.log(`reCAPTCHA v3 validation result:`, recaptchaResult);

      **/

      const user = await AuthService.authenticateUser(email, password);
      if (!user) {
        res.status(401).json(await apiError('Invalid credentials', {}, 401));
        return;
      }

      const tokens = AuthService.generateTokens(user);

      res
        .status(200)
        .json(success('User logged in successfully', 200, { user, ...tokens }));
    } catch (error) {
      res
        .status(500)
        .json(await apiError('Failed to login user', error as any, 500));
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const newAccessToken = AuthService.refreshAccessToken(refreshToken);

      res.status(200).json(
        success('Access token refreshed successfully', 200, {
          accessToken: newAccessToken,
        }),
      );
    } catch (error) {
      res
        .status(401)
        .json(
          await apiError('Invalid or expired refresh token', error as any, 401),
        );
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!req.user) {
        res.status(401).json(apiError('Unauthorized', {}, 401));
        return;
      }

      const userId = (req.user as UserPayload).id;

      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json(apiError('User not found', {}, 404));
        return;
      }

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        res
          .status(400)
          .json(apiError('Current password is incorrect', {}, 400));
        return;
      }

      user.password = await hashPassword(newPassword);
      await user.save();

      res.status(200).json(success('Password changed successfully', 200, user));
    } catch (error: any) {
      res
        .status(500)
        .json(apiError('Failed to change password', error.message, 500));
    }
  }

  // public async googleLogin(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { token } = req.body;
  //     if (!token) {
  //       res.status(400).json(apiError('Google token is required', {}, 400));
  //       return;
  //     }

  //     const user = await AuthService.googleLogin(token);
  //     if (!user) {
  //       res.status(401).json(apiError('Invalid Google token', {}, 401));
  //       return;
  //     }

  //     const tokens = AuthService.generateTokens(user);
  //     res
  //       .status(200)
  //       .json(success('User logged in successfully', 200, { user, ...tokens }));
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json(await apiError('Failed to login with Google', error as any, 500));
  //   }
  // }
}

export default new UserController();
