import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Admin Profile</h6>
            
            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center p-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading profile...</p>
            </div>

            <!-- Profile Data -->
            <div *ngIf="!isLoading && userProfile" class="bg-white rounded p-4 shadow-sm">
              <div class="row">
                <!-- Profile Info -->
                <div class="col-md-6">
                  <h5 class="text-primary mb-3">Administrator Information</h5>
                  <div class="mb-3">
                    <label class="form-label"><strong>Name:</strong></label>
                    <p class="form-control-plaintext">{{ userProfile.displayName || 'System Administrator' }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label"><strong>Email:</strong></label>
                    <p class="form-control-plaintext">{{ userProfile.email }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label"><strong>Role:</strong></label>
                    <span class="badge bg-danger">{{ userProfile.role | titlecase }}</span>
                  </div>
                  <div class="mb-3">
                    <label class="form-label"><strong>Phone Number:</strong></label>
                    <p class="form-control-plaintext">{{ userProfile.phoneNumber || 'Not provided' }}</p>
                  </div>
                </div>

                <!-- System Info -->
                <div class="col-md-6">
                  <h5 class="text-primary mb-3">System Information</h5>
                  <div class="mb-3">
                    <label class="form-label"><strong>Account Status:</strong></label>
                    <span class="badge bg-success">Active Administrator</span>
                  </div>
                  <div class="mb-3">
                    <label class="form-label"><strong>Access Level:</strong></label>
                    <p class="form-control-plaintext">Full System Access</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label"><strong>Created:</strong></label>
                    <p class="form-control-plaintext">{{ userProfile.createdAt | date:'longDate' }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label"><strong>Last Login:</strong></label>
                    <p class="form-control-plaintext">{{ userProfile.lastLogin | date:'short' }}</p>
                  </div>
                </div>
              </div>

              <!-- Edit Profile Button -->
              <div class="row mt-4">
                <div class="col-12">
                  <button class="btn btn-primary" (click)="toggleEditMode()">
                    <i class="fa fa-edit me-2"></i>{{ isEditMode ? 'Cancel Edit' : 'Edit Profile' }}
                  </button>
                </div>
              </div>

              <!-- Edit Form -->
              <div *ngIf="isEditMode" class="mt-4">
                <form [formGroup]="editForm" (ngSubmit)="updateProfile()">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">Display Name</label>
                        <input type="text" class="form-control" formControlName="displayName">
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" formControlName="phoneNumber">
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-success me-2" [disabled]="editForm.invalid || isUpdating">
                    <i class="fa fa-save me-2"></i>{{ isUpdating ? 'Saving...' : 'Save Changes' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Error State -->
            <div *ngIf="!isLoading && !userProfile" class="bg-white rounded p-4 shadow-sm text-center">
              <i class="fa fa-exclamation-triangle text-warning fa-3x mb-3"></i>
              <h5>Profile Not Found</h5>
              <p class="text-muted">Unable to load your profile information. Please try refreshing the page.</p>
              <button class="btn btn-primary" (click)="loadProfile()">
                <i class="fa fa-refresh me-2"></i>Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  userProfile: UserProfile | null = null;
  isLoading = true;
  isEditMode = false;
  isUpdating = false;
  private subscription: Subscription | null = null;

  editForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]]
  });

  ngOnInit() {
    this.loadProfile();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProfile() {
    console.log('🔍 ADMIN PROFILE - Loading profile...');
    this.isLoading = true;
    this.subscription = this.authService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        console.log('🔍 ADMIN PROFILE - Profile received:', profile);
        this.userProfile = profile;
        this.isLoading = false;
        if (profile) {
          this.populateEditForm(profile);
        }
      },
      error: (error) => {
        console.error('🔍 ADMIN PROFILE - Error loading profile:', error);
        this.isLoading = false;
      }
    });
  }

  private populateEditForm(profile: UserProfile) {
    this.editForm.patchValue({
      displayName: profile.displayName || '',
      phoneNumber: profile.phoneNumber || ''
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.userProfile) {
      this.populateEditForm(this.userProfile);
    }
  }

  async updateProfile() {
    if (this.editForm.valid && this.userProfile) {
      this.isUpdating = true;
      try {
        const updates = this.editForm.value;
        console.log('🔍 ADMIN PROFILE - Updating profile with:', updates);
        await this.authService.updateUserProfile(this.userProfile.uid, updates);
        
        // Refresh profile data
        this.loadProfile();
        this.isEditMode = false;
        this.isUpdating = false;
      } catch (error) {
        console.error('🔍 ADMIN PROFILE - Error updating profile:', error);
        this.isUpdating = false;
      }
    }
  }
}