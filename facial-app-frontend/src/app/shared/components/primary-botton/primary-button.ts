import { Component, input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  template: `
    <button class="cursor-pointer rounded-xl w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-on-primary py-2 px-4 font-medium text-[13px] hover:opacity-90 transition-opacity active:scale-[0.98]">
      
      @if (icon()) {
        <svg class="w-4 h-4 shrink-0 fill-current">
          <use [attr.href]="'/sprite.svg#' + icon()"></use>
        </svg>
      }
      
      {{ label() }}
    </button>
  `
})
export class PrimaryButton {
  label = input.required<string>();
  icon = input<string>();
}