import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = false;
  user: UserProfile | null = null;
  isMobileMenuOpen = false;
  activeMenuItem = 'dashboard';
  sidebarCollapsed = false;
  private userSub: Subscription | null = null;

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.getUserProfile(user.uid).subscribe({
          next: (profile) => {
            this.user = profile;
            this.isLoggedIn = true;
          },
          error: (error) => {
            console.error('Error loading user profile in admin navbar:', error);
            this.user = null;
            this.isLoggedIn = false;
          }
        });
      } else {
        this.user = null;
        this.isLoggedIn = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Prevent body scroll when mobile menu is open
    if (typeof document !== 'undefined') {
      if (this.isMobileMenuOpen) {
        document.body.classList.add('mobile-menu-open');
      } else {
        document.body.classList.remove('mobile-menu-open');
      }
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  setActiveMenuItem(item: string) {
    this.activeMenuItem = item;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}