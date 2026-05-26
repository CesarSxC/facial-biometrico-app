import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../interfaces/EmployeeResponse';

@Component({
  selector: 'app-update-employee-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" (click)="close.emit()"></div>

      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
        
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div class="flex items-center text-center gap-2.5 mb-1">
              <div class="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 ">
                <svg class="size-6 text-blue-700 fill-current">
                  <use href="sprite.svg#edit-icon"/>
                </svg> 
              </div>
              <h2 class="text-xl font-bold text-slate-900">Editar Empleado</h2>
            </div>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-slate-600 transition-colors">
            <svg class="size-6">
              <use href="sprite.svg#x-icon"/>
            </svg>
          </button>
        </div>

      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <div class="p-6 space-y-2">
          
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Completo</label>
              <input type="text" formControlName="name" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" [class]="getInputClasses('name')">
              @if (isFieldInvalid('name')) {
                  <span class="text-[11px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">El nombre es obligatorio.</span>
              }
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Email Corporativo</label>
              <input type="email" formControlName="email" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" [class]="getInputClasses('email')">
              @if (isFieldInvalid('email')) {
                  <span class="text-[11px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    @if (employeeForm.get('email')?.hasError('required')) { El email es obligatorio. } 
                    @else if (employeeForm.get('email')?.hasError('email')) { Formato inválido. }
                  </span>
              }           
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Departamento</label>
              <select formControlName="department" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none appearance-none">
                <option>Ingeniería</option>
                <option>Diseño</option>
                <option>Marketing</option>
                <option>Recursos Humanos</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Rol / Cargo</label>
              <input type="text" formControlName="role" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" [class]="getInputClasses('role')">
            </div>
          </div>

          <div class="p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-3 bg-slate-50/50"
               [class.border-amber-500]="fotoSeleccionada()">
            <div class="w-12 h-12 rounded-full flex items-center justify-center"
                 [class.bg-slate-200]="!fotoSeleccionada()" [class.bg-amber-100]="fotoSeleccionada()">
              <input type="file" accept="image/*" (change)="onFileSelected($event)" class="absolute opacity-0 w-12 h-12 cursor-pointer">
              @if (!fotoSeleccionada()) {
                <svg class="size-6 text-slate-400 fill-current">
                  <use href="sprite.svg#camera-icon"/>
                </svg> 
              } @else {
                <svg class="size-6 text-amber-600 fill-current">
                  <use href="sprite.svg#check-icon"/>
                </svg> 
              }
            </div>
            <span class="text-xs font-medium" [class.text-slate-600]="!fotoSeleccionada()" [class.text-amber-600]="fotoSeleccionada()">
              {{ fotoSeleccionada() ? 'Nueva foto: ' + fotoSeleccionada()?.name : 'Actualizar foto facial (Opcional)' }}
            </span>
          </div>

        </div>
        <div class="p-6 bg-slate-50 flex gap-3">
          <button type="button" (click)="close.emit()" class="flex-1 px-6 py-3 rounded-xl border border-slate-400 text-sm text-slate-600 hover:bg-blue-100 transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="isLoading()" class="flex-2 px-6 py-3 bg-blue-700 rounded-xl border border-slate-400 text-sm text-white hover:bg-blue-800 transition-colors">
            @if (isLoading()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Actualizando...
              </span>
            } @else {
              Actualizar Empleado
            }
          </button>          
        </div>
      </form>
    </div>
  `
})
export class UpdateEmployeeModal implements OnInit {
  employeeData = input.required<Employee>();
  
  close = output<void>();
  fotoSeleccionada = signal<File | null>(null);
  isLoading = signal<boolean>(false);

  private employeeService = inject(EmployeeService);

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    const currentEmployee = this.employeeData();
    this.employeeForm.patchValue({
      name: currentEmployee.name,
      email: currentEmployee.email,
      department: currentEmployee.department,
      role: currentEmployee.role
    });
  }

  isFieldInvalid(fieldName:string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoSeleccionada.set(input.files[0]);
    }
  }

  getInputClasses(fieldName: string): string {
    const isInvalid = this.isFieldInvalid(fieldName);
    const baseClasses = "w-full bg-slate-100 border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ";
    
    return isInvalid 
      ? baseClasses + "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      : baseClasses + "border-transparent focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20";
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.employeeForm.value;
    const updateData = {
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      department: formValue.department ?? '',
      role: formValue.role ?? ''
    };

    this.employeeService.updateEmployee(this.employeeData().id, updateData, this.fotoSeleccionada())
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.close.emit();
        },
        error: (error) => {
          console.error('Error al actualizar el empleado:', error);
          this.isLoading.set(false);
          alert('Hubo un error al actualizar. Revisa la consola.');
        }
      });
  }
}