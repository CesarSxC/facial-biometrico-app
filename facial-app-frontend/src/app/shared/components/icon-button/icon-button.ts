import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [],
  template: `
    <button class="p-2 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all duration-200 active:scale-95">
      <svg class="w-5 h-5 fill-current shrink-0">
        <use [attr.href]="'/sprite.svg#' + icon()"></use>
      </svg>
    </button>
  `,
})
export class IconButton {
  icon = input.required<string>();
}
