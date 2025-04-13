import { Router } from 'express';
import { GradeService } from '../services/grade.service';
import { authenticate } from '../middleware/auth';
import { isTeacher } from '../middleware/isTeacher';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const gradeService = new GradeService();

router.post('/', authenticate, isTeacher, async (req, res, next) => {
  try {
    const grade = await gradeService.gradeAssignment({
      ...req.body,
      teacherId: (req as AuthenticatedRequest).user.id,
    });
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
});

router.get('/:studentId', authenticate, async (req, res, next) => {
  try {
    const grades = await gradeService.getGradesByStudent(req.params.studentId);
    res.json(grades);
  } catch (err) {
    next(err);
  }
});

export default router;
