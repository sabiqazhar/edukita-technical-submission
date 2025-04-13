import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from './assignment.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Assignment, assignment => assignment.subject)
  assignments!: Assignment[];
}