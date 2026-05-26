import { Component, inject, OnInit, signal } from '@angular/core';
import { ScanCard } from '../scan-card/scan-card';
import { EmployeeService } from '../../../employee-management/services/employee.service';
import { ScanRecord } from '../../models/scan-record.interface';

@Component({
  selector: 'app-recent-scans',
  standalone: true,
  imports: [ScanCard],
  templateUrl: './recent-scans.html',
})
export class RecentScans implements OnInit {

  private attendanceService = inject(EmployeeService);

  scans = signal<ScanRecord[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadScans();
  }

  loadScans(): void {
    this.isLoading.set(true);
    
    this.attendanceService.getRecentScans(5).subscribe({
      next: (logs) => {
        const mappedRecords: ScanRecord[] = logs.map(log => ({
          id: String(log.id),
          employeeName: log.employee.name,
          role: log.employee.role,
          timestamp: new Date(log.datetime),
          status: 'SUCCESS'
        }));
        
        this.scans.set(mappedRecords);
        this.isLoading.set(false);
      },
      error: (err:any) => {
        console.error('Error al cargar el historial:', err);
        this.isLoading.set(false);
      }
    });
  }
}
