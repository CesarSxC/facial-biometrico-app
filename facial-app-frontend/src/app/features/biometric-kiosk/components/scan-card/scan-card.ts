import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ScanRecord } from '../../models/scan-record.interface';

@Component({
  selector: 'app-scan-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:bg-white/80 transition-colors cursor-default">
      
      <div class="flex items-center gap-3">
        
      <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold uppercase shadow-sm border border-slate-300">
          {{ avatarInitial() }}
        </div>
        
        <div class="flex flex-col">
          <span class="text-sm font-bold text-on-surface leading-tight">
            {{ record().employeeName }}
          </span>
          
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-[10px] font-extrabold tracking-wider {{ stateClasses() }}">
            {{ stateText() }}
            </span>
          </div> 
        </div>
      </div>

      <span class="text-xs font-medium text-on-surface-variant">
        {{ record().timestamp | date:'HH:mm' }}
      </span>
      
    </div>
  `
})
export class ScanCard {
  record = input.required<ScanRecord>();

  // Clases CSS dinámicas
  stateClasses = computed(() => {
    const colorsState = {
      SUCCESS: 'text-emerald-500',
      DENIED: 'text-outline text-red-500'
    }
    return colorsState[this.record().status]
  })

  // Texto dinámico
  stateText = computed(() => {
    return this.record().status === 'SUCCESS' ? 'ACCESO AUTORIZADO' : 'ACCESO DENEGADO';
  });
  
  avatarInitial = computed(() => {
    const name = this.record().employeeName;
    return name ? name.charAt(0).toUpperCase() : '?';
  });
}