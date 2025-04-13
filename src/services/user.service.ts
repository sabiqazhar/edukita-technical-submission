import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';

export class UserService {
    private userRepo = AppDataSource.getRepository(User);
  
    async create(data: Partial<User>): Promise<User> {
      const user = this.userRepo.create(data);
      return await this.userRepo.save(user);
    }
  
    async findAll(): Promise<User[]> {
      return await this.userRepo.find();
    }
  
    async findById(id: string): Promise<User | null> {
      return await this.userRepo.findOneBy({ id });
    }
  }
  