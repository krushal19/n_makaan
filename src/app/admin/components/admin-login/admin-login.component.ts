import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container-fluid position-relative bg-white d-flex p-0">
      <!-- Admin Login Form -->
      <div class="container-fluid">
        <div class="row h-100 align-items-center justify-content-center" style="min-height: 100vh;">
          <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div class="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="text-primary">Admin Login</h3>
                <h3>Makaan</h3>
              </div>
              
              <div class="alert alert-warning" role="alert">
                <i class="fa fa-exclamation-triangle me-2"></i>
                <strong>Admin Access Only</strong><br>
                This is a restricted area for administrators only.
              </div>
              
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="form-floating mb-3">
                  <input 
                    type="email" 
                    class="form-control" 
                    id="floatingInput" 
                    placeholder="name@example.com"
                    formControlName="email"
                    [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <label for="floatingInput">Email address</label>
                  @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                    <div class="invalid-feedback">
                      Please enter a valid email address.
                    </div>
                  }
                </div>
                
                <div class="form-floating mb-4">
                  <input 
                    [type]="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="floatingPassword" 
                    placeholder="Password"
                    formControlName="password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <label for="floatingPassword">Password</label>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-3"
                    style="border: none; background: none; z-index: 10;"
                    (click)="togglePassword()">
                    <i [class]="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                  @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                    <div class="invalid-feedback">
                      Password is required.
                    </div>
                  }
                </div>
                
                @if (errorMessage) {
                  <div class="alert alert-danger" role="alert">
                    <i class="fa fa-exclamation-circle me-2"></i>{{errorMessage}}
                  </div>
                }
                
                <button 
                  type="submit" 
                  class="btn btn-primary py-3 w-100 mb-4"
                  [disabled]="isLoading || loginForm.invalid">
                  @if (isLoading) {
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  }
                  {{isLoading ? 'Signing In...' : 'Sign In as Admin'}}
                </button>
              </form>
              
              <div class="text-center">
                <p class="mb-0">
                  <a routerLink="/" class="text-primary">← Back to Main Site</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
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
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { email, password } = this.loginForm.value;
        
        // Strict validation for admin credentials
        if (email !== 'admin@makaan.com' || password !== 'admin123') {
          throw new Error('Invalid admin credentials');
        }

        const user = await this.authService.login(email, password);
        
        // Double check admin access
        if (user.email === 'admin@makaan.com') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          throw new Error('Unauthorized access');
        }
      } catch (error: any) {
        this.errorMessage = 'Invalid admin credentials. Access denied.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}