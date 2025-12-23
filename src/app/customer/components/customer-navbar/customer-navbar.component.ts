import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-customer-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <div class="container-fluid">
        <a routerLink="/customer/dashboard" class="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
          <h1 class="m-0 text-primary">Makaan</h1>
        </a>
        
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto p-4 p-lg-0">
            <a routerLink="/customer/dashboard" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-tachometer-alt me-2"></i>Dashboard
            </a>
            <a routerLink="/customer/browse" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-search me-2"></i>Browse Properties
            </a>
            <a routerLink="/customer/saved-properties" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-heart me-2"></i>Saved Properties
            </a>
            <a routerLink="/customer/inquiries" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-envelope me-2"></i>My Inquiries
            </a>
            <a routerLink="/customer/profile" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-user me-2"></i>Profile
            </a>
            <button (click)="logout()" class="nav-item nav-link btn btn-link text-danger">
              <i class="fa fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./customer-navbar.component.scss']
})
export class CustomerNavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}