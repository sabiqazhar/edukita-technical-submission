import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { Logger } from '../utils/logger';

const logger = new Logger('AuthMiddleware');

export interface AuthenticatedRequest extends Request {
    user: User;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const userId = req.headers['x-user-id'];
  
    if (!userId || typeof userId !== 'string') {
      res.status(401).json({
        success: false,
        error: 'Authorization header missing'
      });
      return;
    }
  
    AppDataSource.getRepository(User)
      .findOneBy({ id: userId })
      .then(user => {
        if (!user) {
          res.status(401).json({ success: false, error: 'Invalid user' });
          return;
        }
  
        (req as AuthenticatedRequest).user = user;
        next();
      })
      .catch(error => {
        logger.error('Authentication failed', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
  