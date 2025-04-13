import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Grade } from './grade.entity';
import { UserRole } from '../interfaces/types';

@Entity()
export class User { 
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

//   @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT }) sqlite not supported enum
  @Column({ default: "STUDENT" })
  role!: UserRole;

  @OneToMany(() => Assignment, assignment => assignment.student)
  assignment!: Assignment[];

  @OneToMany(() => Grade, grade => grade.teacher)
  grades!: Grade[];
}