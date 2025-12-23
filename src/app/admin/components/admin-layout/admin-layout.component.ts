import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminFooterComponent } from '../admin-footer/admin-footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminHeaderComponent, AdminNavbarComponent, AdminFooterComponent],
  template: `
    <app-admin-header></app-admin-header>
    <app-admin-navbar></app-admin-navbar>
    <main class="admin-main page-wrapper">
      <router-outlet></router-outlet>
    </main>
    <app-admin-footer></app-admin-footer>
  `,
  styles: [`
    .page-wrapper {
      min-height: calc(100vh - 160px);
      padding-top: 80px; /* Space for fixed navbar */
    }
    .admin-main {
      background-color: #f8f9fa;
    }
  `]
})
export class AdminLayoutComponent { }