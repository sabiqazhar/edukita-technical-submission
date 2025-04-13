import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from './user.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @ManyToOne(() => Assignment)
  assignment!: Assignment;

  @ManyToOne(() => User)
  student!: User;

  @ManyToOne(() => User)
  teacher!: User;

  @Column()
  grade!: string;

  @Column('text')
  feedback!: string;

  @CreateDateColumn()
  gradedAt!: Date;
}