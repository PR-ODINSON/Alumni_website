import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';
import { AuthorizationEngine } from '../services/AuthorizationEngine';
import User from '../models/User';
import Job from '../models/Job';
import Event from '../models/Event';
import ResearchProject from '../models/ResearchProject';
import SuccessStory from '../models/SuccessStory';
import Post, { Comment } from '../models/Post';
import Mentorship from '../models/Mentorship';

const modelMap: Record<string, any> = {
  User,
  Job,
  Event,
  ResearchProject,
  SuccessStory,
  Post,
  Comment,
  Mentorship,
};

export interface AuthorizedRequest extends AuthRequest {
  resource?: any;
}

/**
 * Middleware enforcing fine-grained permission checks.
 */
export const requirePermission = (permission: string) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required.', 401));
      }
      const allowed = await AuthorizationEngine.can(req.user, permission);
      if (!allowed) {
        return next(new AppError('Access denied. Insufficient permissions.', 403));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Middleware enforcing that the user has a verified status.
 */
export const requireVerified = () => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (req.user.verificationStatus !== 'verified') {
      return next(
        new AppError(
          `Access denied. Your account status is currently: ${req.user.verificationStatus}. A verified account is required.`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Middleware enforcing resource policies and ownership checks.
 * Resolves the document and attaches it to `req.resource`.
 */
export const requirePolicy = (action: string, modelName: string, idParam = 'id') => {
  return async (req: AuthorizedRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required.', 401));
      }

      const Model = modelMap[modelName];
      if (!Model) {
        return next(new AppError(`Invalid policy model configuration: ${modelName}`, 500));
      }

      const resourceId = req.params[idParam];
      if (!resourceId) {
        return next(new AppError(`Missing resource ID parameter: ${idParam}`, 400));
      }

      // Resolve and fetch the resource
      const resource = await Model.findById(resourceId);
      if (!resource) {
        return next(new AppError(`${modelName} resource not found.`, 404));
      }

      // Check soft-deleted resource bypass (only admins can access soft deleted items)
      if (resource.deletedAt && req.user.role !== 'admin') {
        return next(new AppError(`${modelName} has been deleted.`, 404));
      }

      const allowed = await AuthorizationEngine.can(req.user, action, resource);
      if (!allowed) {
        return next(new AppError('Access denied. Policy check failed.', 403));
      }

      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
};
