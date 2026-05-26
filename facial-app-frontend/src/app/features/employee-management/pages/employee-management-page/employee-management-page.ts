import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { EmployeeTable } from '../../components/employee-table/employee-table';
import { AddEmployeeModal } from '../../components/add-employee-modal/add-employee-modal';
import { PrimaryButton } from '../../../../shared/components/primary-botton/primary-button';
import { EmployeeService } from '../../services/employee.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-management-page',
  standalone: true,
  imports: [EmployeeTable, AddEmployeeModal, PrimaryButton], 
  template: `
    <div class="flex flex-col h-full w-full gap-6 p-2">
      
      <div class="flex items-center justify-between">
        
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold text-on-surface">Gestión de Empleados</h1>
          <p class="text-sm text-on-surface-variant">Gestione los perfiles de los empleados y sus datos biométricos.</p>
        </div>

        <div class="flex items-center content-center gap-4">
          
          <div class="relative">
            <svg class="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <use href="sprite.svg#search-icon" />
            </svg>
            <input type="text"
              placeholder="Buscar empleado..." 
              (input)="onSearch($event)"
              class="pl-9 pr-4 py-2 text-sm border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface-container-lowest w-64">
          </div>
          <div class="flex items-center h-10">
            <app-primary-button (click)="isModalOpen.set(true)" label="Nuevo Empleado" icon="add-icon"></app-primary-button>
          </div>
          </div>
      </div>

      <div class="flex-1 overflow-hidden">
        <app-employee-table class="block h-full"></app-employee-table>
      </div>

      @if (isModalOpen()) {
        @defer {
          <app-add-employee-modal (close)="isModalOpen.set(false)" />
        }
      }

    </div>
  `
})
export class EmployeeManagementPage implements OnInit, OnDestroy {
  isModalOpen = signal(false);
  private employeeService = inject(EmployeeService);

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.employeeService.loadEmployees(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

}