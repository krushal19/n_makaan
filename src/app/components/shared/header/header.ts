import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = false;
  user: UserProfile | null = null;
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;
  private userSub: Subscription | null = null;

  ngOnInit() {
    console.log('🔍 HEADER COMPONENT - ngOnInit called');
    this.userSub = this.authService.user$.subscribe((user) => {
      console.log('🔍 HEADER COMPONENT - Auth user changed:', user?.email || 'No user');
      if (user) {
        console.log('🔍 HEADER COMPONENT - Fetching profile for UID:', user.uid);
        this.authService.getUserProfile(user.uid).subscribe({
          next: (profile) => {
            console.log('🔍 HEADER COMPONENT - Profile received:', profile);
            this.user = profile;
            this.isLoggedIn = true;
          },
          error: (error) => {
            console.error('🔍 HEADER COMPONENT - Error loading user profile:', error);
            this.user = null;
            this.isLoggedIn = false;
          }
        });
      } else {
        console.log('🔍 HEADER COMPONENT - No user, clearing profile');
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
        const navbar = document.querySelector('.modern-navbar');
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

  getUserDisplayName(): string {
    console.log('🔍 HEADER - Getting display name for user:', this.user);
    
    // First priority: displayName if it exists and is not empty
    if (this.user?.displayName && this.user.displayName.trim() !== '') {
      console.log('🔍 HEADER - Using displayName:', this.user.displayName);
      return this.user.displayName.trim();
    }
    
    // Second priority: extract name from email
    if (this.user?.email && this.user.email.trim() !== '') {
      const emailName = this.user.email.split('@')[0];
      console.log('🔍 HEADER - Using email prefix:', emailName);
      return emailName;
    }
    
    // Last resort: Guest (should never show "USER")
    console.log('🔍 HEADER - Fallback to Guest');
    return 'Guest';
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