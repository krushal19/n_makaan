import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-seller-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <div class="container-fluid">
        <a routerLink="/seller/dashboard" class="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
          <h1 class="m-0 text-primary">Makaan</h1>
          <span class="badge bg-secondary ms-2">Seller</span>
        </a>
        
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto p-4 p-lg-0">
            <a routerLink="/seller/dashboard" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-tachometer-alt me-2"></i>Dashboard
            </a>
            <a routerLink="/seller/add-property" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-plus me-2"></i>Add Property
            </a>
            <a routerLink="/seller/my-properties" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-building me-2"></i>My Properties
            </a>
            <a routerLink="/seller/my-customers" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-users me-2"></i>My Customers
            </a>
            <a routerLink="/seller/profile" routerLinkActive="active" class="nav-item nav-link">
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
  styleUrls: ['./seller-navbar.component.scss']
})
export class SellerNavbarComponent {
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