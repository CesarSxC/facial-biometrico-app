import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entiti';

@Entity('attendance_records')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  datetime: Date;

  @ManyToOne(() => Employee, (em) => em.attendances)
  @JoinColumn({ name: 'empleadoId' })
  employee: Employee;
}
