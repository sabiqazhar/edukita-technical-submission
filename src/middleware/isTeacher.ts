import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/types';
import { AuthenticatedRequest } from './auth';

export function isTeacher(req: Request, res: Response, next: NextFunction): void {
  const user = (req as AuthenticatedRequest).user;

  if (user.role !== UserRole.TEACHER) {
    res.status(403).json({ message: 'Only teachers are allowed to perform this action.' });
  }

  next();
}
