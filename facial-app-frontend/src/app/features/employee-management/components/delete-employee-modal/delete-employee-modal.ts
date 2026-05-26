import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-delete-employee-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" (click)="close.emit()"></div>

      <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
        
        <div class="p-6 text-center">
          <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
            <svg class="size-7 text-red-600 fill-current">
              <use href="sprite.svg#trash-icon"/> 
            </svg>
          </div>

          <h3 class="text-xl font-bold text-slate-900 mb-2">¿Eliminar empleado?</h3>
          <p class="text-sm text-slate-500 mb-1">
            Estás a punto de eliminar permanentemente a <strong>{{ employeeName() }}</strong>.
          </p>
          <p class="text-xs text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100 inline-block font-medium">
            Esta acción borrará también todo su historial de asistencia y vectores biométricos.
          </p>
        </div>

        <div class="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
          <button type="button" (click)="close.emit()" [disabled]="isLoading()" 
                  class="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-100 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          
          <button type="button" (click)="onConfirm()" [disabled]="isLoading()" 
                  class="flex-1 px-5 py-3 bg-red-600 rounded-xl text-sm font-semibold text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            @if (isLoading()) {
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Eliminando...
            } @else {
              Sí, eliminar
            }
          </button>
        </div>

      </div>
    </div>
  `
})
export class DeleteEmployeeModal {
  employeeName = input.required<string>();
  close = output<void>();
  confirm = output<void>();
  
  isLoading = signal<boolean>(false);

  onConfirm() {
    this.isLoading.set(true);
    this.confirm.emit();
  }
}