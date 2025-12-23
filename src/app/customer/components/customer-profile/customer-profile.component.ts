import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Customer Profile</h6>
            
            <div class="row">
              <div class="col-md-8">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Personal Information</h6>
                  
                  <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" formControlName="displayName">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" formControlName="email" readonly>
                      </div>
                    </div>
                    
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" formControlName="phoneNumber">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Aadhaar Number</label>
                        <input type="text" class="form-control" formControlName="aadhaarNumber">
                      </div>
                    </div>
                    
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">PAN Number</label>
                        <input type="text" class="form-control" formControlName="panNumber">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Driving License</label>
                        <input type="text" class="form-control" formControlName="drivingLicense">
                      </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" [disabled]="isLoading">
                      @if (isLoading) {
                        <span class="spinner-border spinner-border-sm me-2"></span>
                      }
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Account Status</h6>
                  
                  <div class="mb-3">
                    @if (userProfile?.isVerified) {
                      <span class="badge bg-success">Verified Account</span>
                    } @else {
                      <span class="badge bg-warning">Pending Verification</span>
                    }
                  </div>
                  
                  <div class="mb-3">
                    <small class="text-muted">Member since:</small>
                    <div>{{userProfile?.createdAt?.toDate() | date:'mediumDate'}}</div>
                  </div>
                  
                  <div class="mb-3">
                    <small class="text-muted">Last login:</small>
                    <div>{{userProfile?.lastLogin?.toDate() | date:'short'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = false;

  constructor() {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      aadhaarNumber: [''],
      panNumber: [''],
      drivingLicense: ['']
    });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.authService.getUserProfile(user.uid).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          if (this.userProfile) {
            this.profileForm.patchValue(this.userProfile);
          }
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
        }
      });
    }
  }

  async onSubmit() {
    if (this.profileForm.valid && this.userProfile) {
      this.isLoading = true;
      try {
        await this.authService.updateUserProfile(this.userProfile.uid, this.profileForm.value);
        // Show success message
      } catch (error) {
        console.error('Profile update error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}