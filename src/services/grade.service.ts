import { AppDataSource } from '../data-source';
import { Grade } from '../entities/grade.entity';
import { Assignment } from '../entities/assignment.entity';
import { User } from '../entities/user.entity';

export class GradeService {
  private gradeRepo = AppDataSource.getRepository(Grade);
  private userRepo = AppDataSource.getRepository(User);
  private assignmentRepo = AppDataSource.getRepository(Assignment);

  async gradeAssignment(data: {
    assignmentId: string;
    studentId: string;
    teacherId: string;
    grade: string;
    feedback: string;
  }): Promise<Grade> {
    const assignment = await this.assignmentRepo.findOneByOrFail({ id: data.assignmentId });
    const student = await this.userRepo.findOneByOrFail({ id: data.studentId });
    const teacher = await this.userRepo.findOneByOrFail({ id: data.teacherId });

    const newGrade = this.gradeRepo.create({
      assignment,
      student,
      teacher,
      grade: data.grade,
      feedback: data.feedback
    });

    return this.gradeRepo.save(newGrade);
  }

  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    return this.gradeRepo.find({
      where: { student: { id: studentId } },
      relations: ['assignment', 'teacher']
    });
  }
}
