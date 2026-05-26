import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center gap-3">
    <div class="w-10 h-10 shrink-0 rounded-lg bg-primary flex items-center justify-center text-on-primary">
        <svg class="w-6 h-6 fill-current">
          <use href="/sprite.svg#manufacturing-icon"></use>
        </svg>
      </div>
      
      @if (showText()) {
        <div>
          <h1 class="text-xl font-bold tracking-tighter text-slate-900">Precision OS</h1>
          <p class="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Enterprise Tier</p>
        </div>
      }
    </div>  
  `
})
export class BrandLogo {
  showText = input<boolean>(true);
}
