import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container py-5">
      <div *ngIf="userProfile">
        <h2>Welcome, {{ userProfile.displayName || 'Admin' }}</h2>
        <p>Email: {{ userProfile.email }}</p>
        <p>This is the Admin Dashboard.</p>

        <!-- Admin Controls Placeholder -->
        <div class="mt-4">
            <button class="btn btn-warning me-2">Manage Users</button>
            <button class="btn btn-warning">Manage Properties</button>
        </div>
      </div>
      <div *ngIf="!userProfile && loading">
        <p>Loading user profile...</p>
      </div>
    </div>
  `
})
export class AdminDashboardPage implements OnInit {
    private authService = inject(AuthService);
    userProfile: UserProfile | null = null;
    loading = true;

    ngOnInit() {
        console.log('🔍 ADMIN DASHBOARD - Loading user profile');
        
        this.authService.getCurrentUserProfile().subscribe({
            next: (profile) => {
                console.log('🔍 ADMIN DASHBOARD - Profile loaded:', profile);
                this.userProfile = profile;
                this.loading = false;
            },
            error: (error) => {
                console.error('🔍 ADMIN DASHBOARD - Error loading profile:', error);
                this.loading = false;
            }
        });
    }
}
