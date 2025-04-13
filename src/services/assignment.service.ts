import { AppDataSource } from '../data-source';
import { Assignment } from '../entities/assignment.entity';
import { User } from '../entities/user.entity';
import { Subject } from '../entities/subject.entity';

export class AssignmentService {
  private assignmentRepo = AppDataSource.getRepository(Assignment);
  private userRepo = AppDataSource.getRepository(User);
  private subjectRepo = AppDataSource.getRepository(Subject);

  async createAssignment(data: {
    title: string;
    content: string;
    subjectId: string;
    studentId: string;
  }): Promise<Assignment> {
    const student = await this.userRepo.findOneByOrFail({ id: data.studentId });
    const subject = await this.subjectRepo.findOneByOrFail({ id: data.subjectId });

    const assignment = this.assignmentRepo.create({
      title: data.title,
      content: data.content,
      student,
      subject,
    });

    return this.assignmentRepo.save(assignment);
  }

  async getAssignments(filters?: { subjectId?: string }): Promise<Assignment[]> {
    const query = this.assignmentRepo
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.student', 'student')
      .leftJoinAndSelect('assignment.subject', 'subject');

    if (filters?.subjectId) {
      query.where('subject.id = :subjectId', { subjectId: filters.subjectId });
    }

    return query.getMany();
  }
}