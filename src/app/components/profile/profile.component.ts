import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = true;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
    });
  }

  async ngOnInit() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userProfile = await this.authService.getUserProfile(user.uid);
        if (this.userProfile) {
          this.profileForm.patchValue({
            displayName: this.userProfile.displayName || '',
            email: this.userProfile.email,
            phoneNumber: this.userProfile.phoneNumber || ''
          });
          // Make email readonly since it's the login identifier
          this.profileForm.get('email')?.disable();
        }
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.errorMessage = 'Failed to load profile';
    } finally {
      this.isLoading = false;
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
  }

  async saveProfile() {
    if (this.profileForm.valid && this.userProfile) {
      try {
        const formValue = this.profileForm.value;
        
        // Update the profile in Firestore
        const updatedProfile: UserProfile = {
          ...this.userProfile,
          displayName: formValue.displayName,
          phoneNumber: formValue.phoneNumber
        };

        // Update the profile in Firestore
        const user = this.authService.getCurrentUser();
        if (user) {
          await this.authService.updateUserProfile(user.uid, {
            displayName: formValue.displayName,
            phoneNumber: formValue.phoneNumber
          });
          
          // Update local profile
          this.userProfile = updatedProfile;
        }
        
        this.successMessage = 'Profile updated successfully!';
        this.isEditing = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
      } catch (error) {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile';
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
}