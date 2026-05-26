export interface CreateEmployeeResponse {
  status: string;
  message: string;
  data: Employee;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  biometricStatus: string;
  avatarUrl: string;
} 

export interface AttendanceLog {
  id: string | number;
  datetime: string;
  employee: {
    id: string;
    name: string;
    department: string;
    role: string;
  };
}