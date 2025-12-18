import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.page.html'
})
export class LoginPage {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    selectedRole: 'customer' | 'seller' | 'admin' = 'customer';
    errorMessage = '';
    successMessage = '';
    loading = false;

    async login() {
        this.errorMessage = '';
        this.successMessage = '';
        this.loading = true;

        try {
            // Step 1: Authenticate with Firebase
            const user = await this.authService.login(this.email, this.password);

            // Step 2: Fetch user profile from Firestore
            const profile = await this.authService.getUserProfile(user.uid);
            
            if (!profile) {
                this.errorMessage = 'User profile not found. Please contact support.';
                this.loading = false;
                return;
            }

            // Step 3: Success message and redirect
            this.successMessage = `Welcome back, ${profile.displayName || 'User'}!`;

            setTimeout(() => {
                this.router.navigate(['/dashboard']);
            }, 500);

        } catch (error: any) {
            this.loading = false;

            // Handle Firebase Auth errors
            if (error.code === 'auth/user-not-found') {
                this.errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                this.errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                this.errorMessage = 'Invalid email format.';
            } else if (error.code === 'auth/too-many-requests') {
                this.errorMessage = 'Too many failed attempts. Please try again later.';
            } else {
                this.errorMessage = error.message || 'Login failed. Please try again.';
            }
        }
    }
}
