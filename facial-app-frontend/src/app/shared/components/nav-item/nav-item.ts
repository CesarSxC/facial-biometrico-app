import { Component, input } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterModule, RouterLinkActive],
  template: `
    <a [routerLink]="route()" 
      routerLinkActive 
      [routerLinkActiveOptions]="{ exact: true }" #rla="routerLinkActive"
      [class]="rla.isActive ? activeStyle : inactiveStyle"
      class="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-out font-sans tracking-tight text-[13px]">
      
      <svg class="w-5 h-5 shrink-0 fill-current">
        <use [attr.href]="'/sprite.svg#' + icon()"></use>
      </svg>
      
      {{ label() }}
    </a>
  `
})
export class NavItem {
  label = input.required<string>();
  icon = input.required<string>();
  route = input.required<string>();

  activeStyle = 'text-slate-900 font-semibold bg-slate-200/50';
  inactiveStyle = 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/30';
}
