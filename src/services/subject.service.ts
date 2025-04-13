import { AppDataSource } from '../data-source';
import { Subject } from '../entities/subject.entity';

export class SubjectService {
  private subjectRepo = AppDataSource.getRepository(Subject);

  async findAll(): Promise<Subject[]> {
    return this.subjectRepo.find();
  }

  async findById(id: string): Promise<Subject | null> {
    return this.subjectRepo.findOneBy({ id });
  }
}
