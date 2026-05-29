import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: any;
}

interface JWTPayload {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const user = await User.findById(decoded.id).select('-password -passwordResetToken -emailVerificationToken');

    if (!user) {
      return next(new AppError('User not found. Token is invalid.', 401));
    }

    if (!user.isActive || user.isBanned) {
      return next(new AppError('Account is suspended. Please contact support.', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403));
    }
    next();
  };
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      const user = await User.findById(decoded.id).select('-password');
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};
