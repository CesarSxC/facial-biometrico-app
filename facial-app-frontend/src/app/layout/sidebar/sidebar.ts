import { Component } from '@angular/core';
import { NavItem } from '../../shared/components/nav-item/nav-item'
import { PrimaryButton } from '../../shared/components/primary-botton/primary-button'
import { BrandLogo } from '../../shared/components/brand-logo/brand-logo';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NavItem, PrimaryButton, BrandLogo],
  templateUrl: './sidebar.html',
})
export class Sidebar {}
