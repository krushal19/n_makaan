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
        
        // Block admin credentials from normal login
        if (email === 'admin@makaan.com') {
          this.errorMessage = 'Admin login is restricted. Please use the admin portal.';
          this.isLoading = false;
          return;
        }
        
        const user = await this.authService.login(email, password);
        
        // Use Observable-based getUserProfile and subscribe
        this.authService.getUserProfile(user.uid).subscribe({
          next: (profile) => {
            // Strict role-based redirect
            if (profile?.role === 'seller') {
              this.router.navigate(['/seller']);
            } else if (profile?.role === 'customer') {
              this.router.navigate(['/customer']);
            } else {
              // Fallback for any other case
              this.router.navigate(['/']);
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching user profile:', error);
            this.router.navigate(['/']);
            this.isLoading = false;
          }
        });
      } catch (error: any) {
        this.errorMessage = this.getErrorMessage(error.code);
        this.isLoading = false;
      }
    }
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