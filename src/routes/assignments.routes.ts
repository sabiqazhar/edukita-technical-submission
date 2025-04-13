import { Router } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { NotificationService } from '../services/notification.service';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../middleware/auth';
import { isStudent } from '../middleware/isStudent';

const router = Router();
const assignmentService = new AssignmentService();
const notificationService = new NotificationService();

router.post('/', authenticate, isStudent, async (req, res, next) => {
    try {
      const user = (req as AuthenticatedRequest).user;
  
      const assignment = await assignmentService.createAssignment({
        ...req.body,
        studentId: user.id,
      });
  
      await notificationService.sendAssignmentNotification(assignment, user);
  
      res.status(201).json({ message: 'Assignment submitted', data: assignment });
    } catch (err) {
      next(err);
    }
  });
  

router.get('/', authenticate, async (req, res, next) => {
  try {
    const subject = req.query.subject as string;
    const assignments = await assignmentService.getAssignments({ subjectId: subject });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
});

export default router;
