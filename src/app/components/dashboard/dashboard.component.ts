import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userProfile: UserProfile | null = null;
  isLoading = true;

  async ngOnInit() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userProfile = await this.authService.getUserProfilePromise(user.uid);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      this.isLoading = false;
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
}