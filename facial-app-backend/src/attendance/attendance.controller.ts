import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('employee')
  @UseInterceptors(FileInterceptor('file'))
  async createEmployee(
    @UploadedFile() file: Express.Multer.File,
    @Body() employeeData: CreateEmployeeDto,
  ) {
    if (!file) {
      throw new BadRequestException(
        'La foto del empleado es obligatoria para el registro biométrico.',
      );
    }

    return this.attendanceService.createEmployee(
      employeeData,
      file.buffer,
      file.originalname,
    );
  }

  @Patch('employee/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.attendanceService.updateEmployee(
      id,
      updateEmployeeDto,
      file?.buffer,
      file?.originalname,
    );
  }

  @Delete('employee/:id')
  async remove(@Param('id') id: string) {
    return this.attendanceService.deleteEmployee(id);
  }

  @Post('recognize')
  @UseInterceptors(FileInterceptor('file'))
  async recognizeAndRegister(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Imagen de la cámara no proporcionada.');
    }

    return this.attendanceService.registerAttendance(
      file.buffer,
      file.originalname,
    );
  }

  @Get('employee')
  async getEmployees(@Query('search') search?: string) {
    return this.attendanceService.searchEmployees(search);
  }

  @Get('logs/recent')
  async getRecentLogs(@Query('limit') limit?: number) {
    const parsedLimit = limit ? Number(limit) : 10;
    return await this.attendanceService.getRecentScans(parsedLimit);
  }
}
