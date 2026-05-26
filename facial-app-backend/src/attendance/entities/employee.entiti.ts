import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendance } from './attendance.entiti';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column()
  department: string;

  @Column({ default: 'PENDIENTE' })
  biometricStatus: string;

  @Column({ type: 'simple-json', nullable: true })
  biometricVector: number[];

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];
}
