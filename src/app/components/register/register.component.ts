import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      role: ['customer', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { email, password, displayName, role, aadhaarNumber } = this.registerForm.value;

        console.log('🔄 REGISTRATION FLOW - Starting registration for:', { email, displayName, role });

        // Block admin role registration
        if (role === 'admin') {
          this.errorMessage = 'Admin registration is not allowed through this form.';
          this.isLoading = false;
          return;
        }

        // Step 1: Register user (this creates Firebase Auth + Firestore document)
        await this.authService.register(email, password, displayName, role, aadhaarNumber);
        
        console.log('🔄 REGISTRATION FLOW - Registration successful, executing immediate redirect');
        
        // Step 2: INSTANT role-based redirect after registration
        this.redirectAfterRegistration(role);
      } catch (error: any) {
        console.error('🔄 REGISTRATION FLOW - Registration failed:', error);
        this.errorMessage = this.getErrorMessage(error.code);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private redirectAfterRegistration(role: string) {
    console.log('🔄 REGISTRATION REDIRECT - Executing immediate redirect for role:', role);
    
    // MANDATORY: Instant redirection based on role - CORRECT PATHS
    switch (role) {
      case 'seller':
        console.log('🔄 REGISTRATION REDIRECT - Seller registered, navigating to /seller');
        this.router.navigate(['/seller']);
        break;
      case 'customer':
        console.log('🔄 REGISTRATION REDIRECT - Customer registered, navigating to /dashboard');
        this.router.navigate(['/dashboard']); // Customer dashboard is at /dashboard
        break;
      default:
        console.log('🔄 REGISTRATION REDIRECT - Default role, navigating to /dashboard');
        this.router.navigate(['/dashboard']);
        break;
    }
    
    console.log('🔄 REGISTRATION REDIRECT - Navigation completed, user should see their panel');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      default:
        return 'Registration failed. Please try again.';
    }
  }
}
