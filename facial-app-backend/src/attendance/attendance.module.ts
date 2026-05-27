import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entiti';
import { Attendance } from './entities/attendance.entiti';
import { HttpModule } from '@nestjs/axios';
import { PythonApiService } from '../utils/python-api/python-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Attendance]), HttpModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, PythonApiService],
})
export class AttendanceModule {}
