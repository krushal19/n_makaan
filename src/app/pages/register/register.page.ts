import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.page.html'
})
export class RegisterPage {
    private authService = inject(AuthService);
    private router = inject(Router);

    name = '';
    email = '';
    password = '';
    role: 'customer' | 'seller' | 'admin' = 'customer';
    errorMessage = '';
    successMessage = '';
    loading = false;

    async register() {
        this.errorMessage = '';
        this.successMessage = '';
        this.loading = true;

        // Basic validation
        if (!this.name.trim()) {
            this.errorMessage = 'Please enter your full name.';
            this.loading = false;
            return;
        }

        if (this.password.length < 6) {
            this.errorMessage = 'Password must be at least 6 characters long.';
            this.loading = false;
            return;
        }

        try {
            // Register user using AuthService
            await this.authService.register(
                this.email,
                this.password,
                this.name
            );

            this.successMessage = `Account created successfully as ${this.role}! Redirecting to login...`;

            // Redirect to login after 2 seconds
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 2000);

        } catch (error: any) {
            this.loading = false;

            // Handle Firebase Auth errors
            if (error.code === 'auth/email-already-in-use') {
                this.errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/invalid-email') {
                this.errorMessage = 'Invalid email format.';
            } else if (error.code === 'auth/weak-password') {
                this.errorMessage = 'Password is too weak. Use at least 6 characters.';
            } else {
                this.errorMessage = error.message || 'Registration failed. Please try again.';
            }
        }
    }
}
