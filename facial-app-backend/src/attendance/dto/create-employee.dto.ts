import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role!: string;

  @IsString()
  department!: string;
}
