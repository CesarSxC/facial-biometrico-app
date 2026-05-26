import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, RouterModule, Header],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
