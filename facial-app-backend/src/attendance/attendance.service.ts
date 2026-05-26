import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entiti';
import { Attendance } from './entities/attendance.entiti';
import { Like, Repository } from 'typeorm';
import { PythonApiService } from '../utils/python-api/python-api.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private readonly pythonApiService: PythonApiService,
  ) {}

  async registerAttendance(imageBuffer: Buffer, fileName: string) {
    const employees = await this.employeeRepository.find({
      where: { biometricStatus: 'REGISTRADO' },
    });

    const baseDatosVectores: Record<string, number[]> = {};
    for (const emp of employees) {
      if (emp.biometricVector) {
        baseDatosVectores[emp.name] = emp.biometricVector;
      }
    }

    const iaResponse = await this.pythonApiService.recognizeFace(
      imageBuffer,
      fileName,
      baseDatosVectores,
    );

    const rostrosDetectados = iaResponse.data;

    if (!rostrosDetectados || rostrosDetectados.length === 0) {
      throw new UnauthorizedException('No face detected in the image.');
    }

    const aiRecognizedName = rostrosDetectados[0].nombre;

    if (aiRecognizedName === 'Desconocido') {
      throw new UnauthorizedException(
        'Rostro no reconocido por el modelo de la IA',
      );
    }

    const employee = await this.employeeRepository.findOne({
      where: { name: aiRecognizedName },
    });

    if (!employee) {
      throw new NotFoundException(
        `Reconocido '${aiRecognizedName}', pero el empleado no existe en la BD.`,
      );
    }

    const newAttendance = this.attendanceRepository.create({ employee });
    await this.attendanceRepository.save(newAttendance);

    return {
      status: 'success',
      message: `Asistencia registrada con exito, usuario: ${employee.name}`,
      timestamp: newAttendance.datetime,
    };
  }

  async createEmployee(
    employeeData: CreateEmployeeDto,
    imageBuffer: Buffer,
    fileName: string,
  ) {
    try {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { name: employeeData.name },
      });

      if (existingEmployee) {
        throw new UnauthorizedException(
          `El empleado '${employeeData.name}' ya existe.`,
        );
      }

      const vectorMatematico = await this.pythonApiService.enrollFace(
        imageBuffer,
        fileName,
      );

      const newEmployee = this.employeeRepository.create({
        ...employeeData,
        biometricStatus: 'REGISTRADO',
        biometricVector: vectorMatematico,
      });

      await this.employeeRepository.save(newEmployee);

      return {
        status: 'success',
        message: 'Empleado creado y enrolado biométricamente con exito.',
        data: newEmployee,
      };
    } catch (error) {
      if (error.status) throw error;
      console.error(error);
      throw new InternalServerErrorException(
        'Error creando empleado en la db o en el microservicio de IA.',
      );
    }
  }

  async deleteEmployee(idEmployee: string): Promise<{ message: string }> {
    const employee = await this.employeeRepository.findOne({
      where: { id: idEmployee },
    });

    if (!employee) {
      throw new NotFoundException(
        `No se encontró ningún empleado con el id ${idEmployee}`,
      );
    }

    await this.attendanceRepository.delete({ employee: { id: idEmployee } });
    await this.employeeRepository.remove(employee);

    return { message: `Empleado con id ${idEmployee} eliminado correctamente` };
  }

  async updateEmployee(
    idEmployee: string,
    updateEmployeeDto: UpdateEmployeeDto,
    imageBuffer?: Buffer,
    fileName?: string,
  ): Promise<Employee> {
    const employeeToUpdate = await this.employeeRepository.preload({
      id: idEmployee,
      ...updateEmployeeDto,
    });

    if (!employeeToUpdate) {
      throw new NotFoundException(
        `No se encontró ningún empleado con el id ${idEmployee}`,
      );
    }

    if (imageBuffer && fileName) {
      const vectorMatematico = await this.pythonApiService.enrollFace(
        imageBuffer,
        fileName,
      );
      employeeToUpdate.biometricVector = vectorMatematico;
    }

    return await this.employeeRepository.save(employeeToUpdate);
  }

  async getRecentScans(limit: number = 10) {
    return await this.attendanceRepository.find({
      relations: ['employee'],
      order: {
        datetime: 'DESC',
      },
      take: limit,
    });
  }

  async searchEmployees(search?: string): Promise<Employee[]> {
    try {
      if (search) {
        return await this.employeeRepository.find({
          where: [
            { name: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
            { department: Like(`%${search}%`) },
            { role: Like(`%${search}%`) },
          ],
        });
      }
      return await this.employeeRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener los empleados de la base de datos.',
      );
    }
  }
}
