import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
      <div class="container-fluid">
        <a routerLink="/" class="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
          <h1 class="m-0 text-primary">Makaan</h1>
        </a>
        
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto p-4 p-lg-0">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item nav-link">
              <i class="fa fa-home me-2"></i>Home
            </a>
            <a routerLink="/property" routerLinkActive="active" class="nav-item nav-link">
              <i class="fa fa-search me-2"></i>Browse Properties
            </a>
            <a routerLink="/wishlist" routerLinkActive="active" class="nav-item nav-link" *ngIf="isLoggedIn">
              <i class="fa fa-heart me-2"></i>Wishlist
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-item nav-link" *ngIf="isLoggedIn">
              <i class="fa fa-user me-2"></i>Profile
            </a>
            <a routerLink="/login" class="nav-item nav-link" *ngIf="!isLoggedIn">
              <i class="fa fa-sign-in-alt me-2"></i>Login
            </a>
            <button (click)="logout()" class="nav-item nav-link btn btn-link text-danger" *ngIf="isLoggedIn">
              <i class="fa fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./customer-navbar.component.scss']
})
export class CustomerNavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoggedIn = false;
  private userSub: Subscription | null = null;

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}