import { Component, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" (click)="close.emit()"></div>

      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
        
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div class="flex items-center gap-2.5 mb-1">
              <div class="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 ">
                <svg class="size-6 text-slate-700 fill-current">
                  <use href="sprite.svg#person-icon"/>
                </svg> 
              </div>
              <h2 class="text-xl font-bold text-slate-900">Nuevo Empleado</h2>
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
              <input type="text" formControlName="name" placeholder="Ej. Juan López" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              [class]="getInputClasses('name')">

              @if (isFieldInvalid('name')) {
                  <span class="text-[11px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    El nombre es obligatorio.
                  </span>
                }

            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Email Corporativo</label>
              <input type="email" formControlName="email" placeholder="Ej. juanl@gmail.com" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              [class]="getInputClasses('name')">

              @if (isFieldInvalid('email')) {
                  <span class="text-[11px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    @if (employeeForm.get('email')?.hasError('required')) {
                      El email es obligatorio.
                    } @else if (employeeForm.get('email')?.hasError('email')) {
                      Formato de email inválido.
                    }
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
              <input type="text" formControlName="role" placeholder="Ej. Frontend Dev" class="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
            </div>
          </div>

          <div class="p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-3 bg-slate-50/50"
               [class.border-green-500]="fotoSeleccionada()">
            <div class="w-12 h-12 rounded-full flex items-center justify-center"
                 [class.bg-primary]="!fotoSeleccionada()" [class.bg-green-100]="fotoSeleccionada()">
              <input type="file" accept="image/*" (change)="onFileSelected($event)" class="absolute opacity-0 w-12 h-12 cursor-pointer">
              @if (!fotoSeleccionada()) {
                <svg class="size-6 text-white fill-current">
                  <use href="sprite.svg#camera-icon"/>
                </svg> 
              } @else {
                <svg class="size-6 text-emerald-600 fill-current">
                  <use href="sprite.svg#check-icon"/>
                </svg> 
              }
            </div>
            <span class="text-xs font-medium" [class.text-slate-600]="!fotoSeleccionada()" [class.text-green-600]="fotoSeleccionada()">
              {{ fotoSeleccionada() ? 'Foto lista: ' + fotoSeleccionada()?.name : 'Subir foto facial clara y frontal' }}
            </span>
            <div class="flex items-start justify-center gap-1.5 px-4 text-xs text-slate-400 leading-tight text-center max-w-70">
            <span>Por privacidad, la imagen <strong>no se almacena</strong>. Solo se utiliza temporalmente para generar el vector biométrico.</span>
          </div>
          </div>

        </div>
        <div class="p-6 bg-slate-50 flex gap-3">
          <button type="button" (click)="close.emit()" class="flex-1 px-6 py-3 rounded-xl border border-slate-400 text-sm text-slate-600 hover:bg-surface-container-low transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="isLoading()" class="flex-2 px-6 py-3 bg-slate-900 rounded-xl border border-slate-400 text-sm text-white hover:bg-slate-800 transition-colors">
            @if (isLoading()) {
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando IA...
            } @else {
              Guardar Empleado
            }
          </button>          
        </div>
      </form>
    </div>
  `
})
export class AddEmployeeModal {
  // Evento personalizado del componente
  close = output<void>();
  
  fotoSeleccionada = signal<File | null>(null);
  isLoading = signal<boolean>(false);

  // Instanciamos el servicio
  private employeeService = inject(EmployeeService);

  // Modelo del formulario y definición de campos
  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('Ingeniería', [Validators.required]),
    role: new FormControl('', [Validators.required])
  })

  // Verificación de los inputs si existe, si su estado es invalido y si el usuario interactuo.
  isFieldInvalid(fieldName:string): boolean {
    const control = this.employeeForm.get(fieldName)
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event) {
  // Escuchamos el evento del input
  const input = event.target as HTMLInputElement;
  // Verificamos si existe un archivo y si hay minimo uno
  if (input.files && input.files.length > 0) {
      // Seleccionamos el primer archivo 
      this.fotoSeleccionada.set(input.files[0]);
    }
  }

  // Clases para los inputs, segun su estado
  getInputClasses(fieldName: string): string {
    const isInvalid = this.isFieldInvalid(fieldName);

    const baseClasses = "w-full bg-slate-100 border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors ";
    
    if (isInvalid) {
      return baseClasses + "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";
    } else {
      return baseClasses + "border-transparent focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20";
    }
  }

  onSubmit() {
    // Verificamos el estado del formulario
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    // Verificamos si existe la foto seleccionada
    if (!this.fotoSeleccionada()) {
      alert('Por favor, sube una foto para extraer el vector biométrico.');
      return;
    }
    
    this.isLoading.set(true);

    // Obtenemos los valores del formulario
    const formValue = this.employeeForm.value;
    // Asingnacion al objeto para enviar al backend
    const employeeData = {
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      department: formValue.department ?? '',
      role: formValue.role ?? ''
    };

    this.employeeService.createEmployee(employeeData, this.fotoSeleccionada()!)
      .subscribe({
        next: (response) => {
          console.log('¡Empleado guardado exitosamente!', response);
          this.isLoading.set(false);
          this.close.emit();
        },
        error: (error) => {
          console.error('Error al guardar el empleado:', error);
          this.isLoading.set(false);
          alert('Hubo un error al guardar. Revisa la consola.');
        }
      });
  }
}