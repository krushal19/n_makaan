import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="seller-navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h3>🏠 Makaan Seller</h3>
        </div>

        <div class="navbar-menu">
          <a
            routerLink="/seller"
            routerLinkActive="active"
            class="navbar-link"
            (click)="closeMobileMenu()"
          >
            📊 Dashboard
          </a>
          <a
            routerLink="/seller/add-property"
            routerLinkActive="active"
            class="navbar-link"
            (click)="closeMobileMenu()"
          >
            ➕ Add Property
          </a>
          <a
            routerLink="/seller/my-properties"
            routerLinkActive="active"
            class="navbar-link"
            (click)="closeMobileMenu()"
          >
            📋 My Properties
          </a>
        </div>

        <div class="navbar-actions">
          <div class="user-info" *ngIf="user">
            <span class="user-name">{{ user.displayName || user.email }}</span>
          </div>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">
            🚪 Logout
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" *ngIf="isMobile">
          <span class="hamburger" [class.active]="isMobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="isMobileMenuOpen" *ngIf="isMobile">
        <a
          routerLink="/seller"
          routerLinkActive="active"
          class="mobile-link"
          (click)="closeMobileMenu()"
        >
          📊 Dashboard
        </a>
        <a
          routerLink="/seller/add-property"
          routerLinkActive="active"
          class="mobile-link"
          (click)="closeMobileMenu()"
        >
          ➕ Add Property
        </a>
        <a
          routerLink="/seller/my-properties"
          routerLinkActive="active"
          class="mobile-link"
          (click)="closeMobileMenu()"
        >
          📋 My Properties
        </a>
        <button class="btn btn-outline-light mobile-logout" (click)="logout()">
          🚪 Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .seller-navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .navbar-brand h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .navbar-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .navbar-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .navbar-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 600;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      background: transparent;
      color: white;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-outline-light {
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-outline-light:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: white;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
    }

    .hamburger {
      width: 24px;
      height: 18px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .hamburger span {
      width: 100%;
      height: 2px;
      background: white;
      transition: all 0.3s;
      transform-origin: center;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    .mobile-menu {
      display: none;
      background: rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
    }

    .mobile-menu.open {
      display: block;
    }

    .mobile-link {
      display: block;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      padding: 1rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s;
    }

    .mobile-link:hover,
    .mobile-link.active {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .mobile-logout {
      width: 100%;
      margin: 1rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
        height: 60px;
      }

      .navbar-brand h3 {
        font-size: 1.25rem;
      }

      .navbar-menu {
        display: none;
      }

      .navbar-actions {
        display: none;
      }

      .mobile-menu-toggle {
        display: block;
      }

      .mobile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class SellerNavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  user: UserProfile | null = null;
  isMobileMenuOpen = false;
  isMobile = false;
  private userSub: Subscription | null = null;

  ngOnInit() {
    this.checkMobile();
    this.userSub = this.authService.user$.subscribe(async (user) => {
      try {
        if (user) {
          this.user = await this.authService.getUserProfile(user.uid);
        } else {
          this.user = null;
        }
      } catch (error) {
        console.error('Error loading user profile in seller navbar:', error);
        this.user = null;
      }
    });

    // Listen for window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkMobile());
    }
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  private checkMobile() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.isMobileMenuOpen = false;
      }
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
