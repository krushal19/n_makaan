import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { email, password } = this.loginForm.value;
        
        console.log('🔄 LOGIN FLOW - Starting login for:', email);
        
        // Block admin credentials from normal login
        if (email === 'admin@makaan.com') {
          this.errorMessage = 'Admin login is restricted. Please use the admin portal.';
          this.isLoading = false;
          return;
        }
        
        // Step 1: Firebase Authentication
        console.log('🔄 LOGIN FLOW - Step 1: Firebase Auth');
        const user = await this.authService.login(email, password);
        console.log('🔄 LOGIN FLOW - Step 1 SUCCESS: Auth UID:', user.uid);
        
        // Step 2: Fetch users/{uid} from Firestore
        console.log('🔄 LOGIN FLOW - Step 2: Fetching users/' + user.uid + ' from Firestore');
        
        this.authService.getUserProfile(user.uid).subscribe({
          next: (profile) => {
            console.log('🔄 LOGIN FLOW - Step 2 SUCCESS: Profile fetched:', profile);
            
            if (profile && profile.role) {
              console.log('🔄 LOGIN FLOW - Step 3: Role detected:', profile.role);
              // Step 3: IMMEDIATE redirect based on role
              this.executeImmediateRedirect(profile.role);
            } else {
              console.error('🔄 LOGIN FLOW - ERROR: No profile or role found');
              console.error('🔄 LOGIN FLOW - This means users/{uid} document does not exist in Firestore');
              this.errorMessage = 'User profile not found. Please contact support.';
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('🔄 LOGIN FLOW - ERROR: Failed to fetch profile from Firestore:', error);
            console.error('🔄 LOGIN FLOW - This means users collection or document does not exist');
            this.isLoading = false;
            this.errorMessage = 'Failed to load user profile. Please try again.';
          }
        });
      } catch (error: any) {
        console.error('🔄 LOGIN FLOW - ERROR: Firebase Auth failed:', error);
        this.errorMessage = this.getErrorMessage(error.code);
        this.isLoading = false;
      }
    }
  }

  private executeImmediateRedirect(role: string) {
    console.log('🔄 LOGIN REDIRECT - Executing IMMEDIATE redirect for role:', role);
    
    // MANDATORY: Instant redirection - NO delays, NO lingering
    switch (role) {
      case 'admin':
        console.log('🔄 LOGIN REDIRECT - Admin → /admin/dashboard');
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'seller':
        console.log('🔄 LOGIN REDIRECT - Seller → /seller');
        this.router.navigate(['/seller']);
        break;
      case 'customer':
        console.log('🔄 LOGIN REDIRECT - Customer → /dashboard');
        this.router.navigate(['/dashboard']); // Customer dashboard is at /dashboard
        break;
      default:
        console.log('🔄 LOGIN REDIRECT - Unknown role, defaulting to customer dashboard');
        this.router.navigate(['/dashboard']);
        break;
    }
    
    console.log('🔄 LOGIN REDIRECT - Navigation executed, user should NO LONGER see login page');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'Login failed. Please try again.';
    }
  }
}