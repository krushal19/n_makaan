import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = false;
  user: UserProfile | null = null;
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;
  private userSub: Subscription | null = null;

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(async (user) => {
      try {
        if (user) {
          this.user = await this.authService.getUserProfile(user.uid);
          this.isLoggedIn = true;
        } else {
          this.user = null;
          this.isLoggedIn = false;
        }
      } catch (error) {
        console.error('Error loading user profile in admin header:', error);
        this.user = null;
        this.isLoggedIn = false;
      }
    });

    // Add scroll listener for sticky navbar
    this.addScrollListener();
  }

  private addScrollListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.admin-navbar');
        if (navbar) {
          if (window.scrollY > 50) {
            navbar.classList.add('sticky');
          } else {
            navbar.classList.remove('sticky');
          }
        }
      });
    }
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
      console.error('Error logging out:', error);
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
    this.activeDropdown = null;

    // Re-enable body scroll
    if (typeof document !== 'undefined') {
      document.body.classList.remove('mobile-menu-open');
    }
  }

  showDropdown(dropdown: string) {
    this.activeDropdown = dropdown;
  }

  hideDropdown(dropdown: string) {
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    }
  }
}
