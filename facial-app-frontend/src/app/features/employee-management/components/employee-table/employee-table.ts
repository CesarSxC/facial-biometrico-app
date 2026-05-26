import { Component, inject, signal } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { DeleteEmployeeModal } from '../delete-employee-modal/delete-employee-modal';
import { UpdateEmployeeModal } from '../update-employee-modal/update-employee-modal';
import { Employee } from '../../interfaces/EmployeeResponse';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [UpdateEmployeeModal, DeleteEmployeeModal],
  template: `
    <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          
          <thead class="bg-surface-container-low border-b border-outline-variant/30 text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            <tr>
              <th class="px-6 py-4 rounded-tl-2xl">Empleado</th>
              <th class="px-6 py-4">Rol & Departamento</th>
              <th class="px-6 py-4">Estado Biométrico</th>
              <th class="px-6 py-4 text-right rounded-tr-2xl">Acciones</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-outline-variant/20 text-sm">
            
            @for (emp of employees(); track emp.id) {
              <tr class="hover:bg-surface-container-low/50 transition-colors group">
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold uppercase">
                      {{ getAvatar(emp.name) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-on-surface">{{ emp.name }}</span>
                      <span class="text-xs text-on-surface-variant">{{ emp.email }}</span>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap flex flex-col">
                  <span class="font-medium text-on-surface">{{ emp.role }}</span>
                  <span class="text-xs text-on-surface-variant">{{ emp.department }}</span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full
                  {{ getBiometricClasses(emp.biometricStatus) }}">
                    {{ emp.biometricStatus }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openUpdateModal(emp)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <svg class="size-5 fill-current">
                        <use href="sprite.svg#edit-icon"/> 
                      </svg>                    </button>
                    <button (click)="openDeleteModal(emp)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <svg class="size-5 fill-current">
                        <use href="sprite.svg#trash-icon"/> 
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                  No hay empleados registrados en el sistema.
                </td>
              </tr>
            }

          </tbody>
        </table>
      </div>
    </div>
    @if (isUpdateModalOpen() && employeeToEdit()) {
      <app-update-employee-modal 
        [employeeData]="employeeToEdit()!" 
        (close)="closeUpdateModal()">
      </app-update-employee-modal>
    }
    @if (isDeleteModalOpen() && employeeToDelete()) {
      <app-delete-employee-modal
        [employeeName]="employeeToDelete()!.name"
        (close)="closeDeleteModal()"
        (confirm)="executeDelete()">
      </app-delete-employee-modal>
    }
  `
})
export class EmployeeTable {
  private employeeService = inject(EmployeeService);
  employees = this.employeeService.employees;

  isUpdateModalOpen = signal<boolean>(false);
  employeeToEdit = signal<Employee | null>(null);

  isDeleteModalOpen = signal<boolean>(false);
  employeeToDelete = signal<Employee | null>(null);
  

  ngOnInit(): void {
    this.employeeService.loadEmployees(); 
  }

  openUpdateModal(employee: Employee): void {
    this.employeeToEdit.set(employee);
    this.isUpdateModalOpen.set(true);
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen.set(false);
    this.employeeToEdit.set(null);
  }

  openDeleteModal(employee: Employee): void {
    this.employeeToDelete.set(employee);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.employeeToDelete.set(null);
  }

  executeDelete(): void {
    const employee = this.employeeToDelete();
    if (!employee) return;

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('No se pudo eliminar el registro.');
        this.closeDeleteModal();
      }
    });
  }

  getBiometricClasses(status: string): string {
    const classes = {
      'REGISTRADO': 'bg-emerald-100 text-emerald-700',
      'PENDIENTE': 'bg-amber-100 text-amber-700'
    };
    return classes[status as keyof typeof classes] || 'bg-slate-100 text-slate-700';
  }

  getAvatar(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}