import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/types';
import { AuthenticatedRequest } from './auth';

export function isStudent(req: Request, res: Response, next: NextFunction): void {
  const user = (req as AuthenticatedRequest).user;

  if (user.role !== UserRole.STUDENT) {
    res.status(403).json({ message: 'Only students are allowed to perform this action.' });
  }

  next();
}
