import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { environment } from "../../../../environments/enviroment";
import { AttendanceLog, CreateEmployeeResponse, Employee } from "../interfaces/EmployeeResponse";

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private readonly API_URL = `${environment.apiUrl}/attendance`;
  private http = inject(HttpClient);
  // Signal de estado de empleados
  private employeesData = signal<Employee[]> ([])
  employees = this.employeesData.asReadonly();

  private scanRefreshSource = new Subject<void>();
  scanRefresh = this.scanRefreshSource.asObservable()
  
  // Peticion HTTP para obtener y buscar los empleados
  loadEmployees(search?: string): void {
    let params = new HttpParams();
    
    if (search) {
      params = params.set('search', search); 
    }

    this.http.get<Employee[]>(`${this.API_URL}/employee`, { params }).subscribe({
      next: (data) => {
        this.employeesData.set(data);
      },
      error: (err) => console.error('Error cargando empleados:', err)
    });
  }

  notifyNewScan() {
  this.scanRefreshSource.next();
  }
  
  //Funcion para crear un empleado, omitimos los datos que hara el backend de Employee
  createEmployee(employeeData: Omit<Employee, 'id' | 'biometricStatus' | 'avatarUrl'>, photoFile: File): Observable<CreateEmployeeResponse> {
    // Respuesta de función privada para construir el formData
    const formData = this.employeeFormData(employeeData, photoFile);
    // Petición HTTP al backend
    return this.http.post<CreateEmployeeResponse>(`${this.API_URL}/employee`, formData).pipe(
      // Verificamos si la respuesta es exitosa
      tap((response) => {
      if (response.status === 'success') {
        const empleadoCreadoEnDb = response.data;
        this.employeesData.update(prev => [...prev, empleadoCreadoEnDb]);
      }
    })
    );
  }

  updateEmployee(id:string, updateData: Partial<Employee>, photoFile?: File | null ): Observable<Employee> {
    const formData = this.employeeFormData(updateData, photoFile);

    return this.http.patch<Employee>(`${this.API_URL}/employee/${id}`, formData).pipe(
      tap((updatedEmployee) => {
        this.employeesData.update(currentEmployees => 
          currentEmployees.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp)
        );
      })
    );

  }

  deleteEmployee(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/employee/${id}`).pipe(
      tap(() => {
        this.employeesData.update(prev => prev.filter(emp => emp.id !== id));
      })
    );
  }

  getRecentScans(limit: number = 10): Observable<AttendanceLog[]> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<AttendanceLog[]>(`${this.API_URL}/logs/recent`, { params });
  }
  
  private employeeFormData(data: Partial<Employee>, file?: File | null): FormData {
    const formData = new FormData();
    
    // Obtenemos las keys del objeto,
    Object.keys(data).forEach(key => {
      // Obtenemos el valor de cada key
      const value = data[key as keyof typeof data];
      if (value !== undefined && value !== null) {
        //Agregamos la key y su valor al formData
        formData.append(key, value.toString());
      }
    });

    // Añadimos el archivo al final
    if (file) {
      formData.append('file', file);
    }
    
    return formData;
  }
  
}