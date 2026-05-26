import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./features/biometric-kiosk/pages/kiosk-page/kiosk-page')
      .then(c => c.KioskPage)
  },
  
  {
    path: 'employee-management',
    loadComponent: () => import('./features/employee-management/pages/employee-management-page/employee-management-page')
      .then(c => c.EmployeeManagementPage)
  },
];
