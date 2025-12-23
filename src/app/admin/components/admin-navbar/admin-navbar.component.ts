import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <div class="container-fluid">
        <a routerLink="/admin/dashboard" class="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
          <h1 class="m-0 text-primary">Makaan</h1>
          <span class="badge bg-danger ms-2">Admin</span>
        </a>
        
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto p-4 p-lg-0">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-tachometer-alt me-2"></i>Dashboard
            </a>
            
            <div class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <i class="fa fa-users me-2"></i>Customer Management
              </a>
              <div class="dropdown-menu fade-up m-0">
                <a routerLink="/admin/customers/list" class="dropdown-item">Customer List</a>
                <a routerLink="/admin/customers/verification" class="dropdown-item">ID Verification</a>
              </div>
            </div>
            
            <div class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <i class="fa fa-store me-2"></i>Seller Management
              </a>
              <div class="dropdown-menu fade-up m-0">
                <a routerLink="/admin/sellers/list" class="dropdown-item">Seller List</a>
                <a routerLink="/admin/sellers/properties" class="dropdown-item">Property Moderation</a>
                <a routerLink="/admin/sellers/verification" class="dropdown-item">Seller Verification</a>
              </div>
            </div>
            
            <div class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <i class="fa fa-shield-alt me-2"></i>Verification & Reports
              </a>
              <div class="dropdown-menu fade-up m-0">
                <a routerLink="/admin/reports" class="dropdown-item">Reports Management</a>
                <a routerLink="/admin/blocked-users" class="dropdown-item">Blocked Users</a>
                <a routerLink="/admin/verification-center" class="dropdown-item">Verification Center</a>
              </div>
            </div>
            
            <a routerLink="/admin/profile" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-user me-2"></i>Profile
            </a>
            
            <a routerLink="/admin/user-management" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-user-plus me-2"></i>Add Users
            </a>
            
            <button (click)="logout()" class="nav-item nav-link btn btn-link text-danger">
              <i class="fa fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}