import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
    selector: 'app-seller-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container py-5">
      <div *ngIf="userProfile">
        <h2>Welcome, {{ userProfile.displayName || (userProfile.email ? userProfile.email.split('@')[0] : 'Guest') }}</h2>
        <p>Email: {{ userProfile.email }}</p>
        <p>This is the Seller Dashboard.</p>
        
        <!-- Add Property Section Placeholder -->
        <div class="mt-4">
            <button class="btn btn-primary">Add Property</button>
        </div>
      </div>
      <div *ngIf="!userProfile && loading">
        <p>Loading user profile...</p>
      </div>
    </div>
  `
})
export class SellerDashboardPage implements OnInit {
    private authService = inject(AuthService);
    userProfile: UserProfile | null = null;
    loading = true;

    ngOnInit() {
        console.log('🔍 SELLER DASHBOARD - Loading user profile');
        
        this.authService.getCurrentUserProfile().subscribe({
            next: (profile) => {
                console.log('🔍 SELLER DASHBOARD - Profile loaded:', profile);
                this.userProfile = profile;
                this.loading = false;
            },
            error: (error) => {
                console.error('🔍 SELLER DASHBOARD - Error loading profile:', error);
                this.loading = false;
            }
        });
    }
}
