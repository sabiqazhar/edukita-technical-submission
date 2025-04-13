import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { User } from './user.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @ManyToOne(() => User, user => user.assignment)
  student!: User;

  @ManyToOne(() => Subject, subject => subject.assignments)
  subject!: Subject;

  @CreateDateColumn()
  createdAt!: Date;
}
