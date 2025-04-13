import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { Subject } from '../entities/subject.entity';
import { UserRole } from '../interfaces/types';

async function seed() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const subjectRepo = AppDataSource.getRepository(Subject);

  const subjects = subjectRepo.create([
    { name: 'Math' },
    { name: 'English' }
  ]);
  await subjectRepo.save(subjects);

  const students = Array.from({ length: 10 }, (_, i) =>
    userRepo.create({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@edukita.edu`,
      role: UserRole.STUDENT
    })
  );

  const teachers = Array.from({ length: 5 }, (_, i) =>
    userRepo.create({
      name: `Teacher ${i + 1}`,
      email: `teacher${i + 1}@edukita.edu`,
      role: UserRole.TEACHER
    })
  );

  await userRepo.save([...students, ...teachers]);

  console.log('✅ Seeding done!');
  await AppDataSource.destroy();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
});
