/**
 * DEMO CUSTOMER ACCOUNT CREATION SCRIPT
 * 
 * This script creates a demo customer account in Firebase Authentication
 * and Firestore using the exact same methods as your AuthService.
 * 
 * Demo Account Details:
 * - Name: Demo User
 * - Email: demo_customer@example.com
 * - Password: Demo@123
 * - Role: customer
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-create-demo-account',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 20px;">
      <h2>Create Demo Customer Account</h2>
      <button 
        (click)="createDemoAccount()" 
        [disabled]="loading"
        style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
        {{ loading ? 'Creating...' : 'Create Demo Account' }}
      </button>
      
      <div *ngIf="message" [style.color]="isError ? 'red' : 'green'" style="margin-top: 10px;">
        {{ message }}
      </div>
      
      <div *ngIf="accountCreated" style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
        <h3>✅ Demo Account Created Successfully!</h3>
        <p><strong>Email:</strong> demo_customer@example.com</p>
        <p><strong>Password:</strong> Demo@123</p>
        <p><strong>Role:</strong> Customer</p>
        <p><strong>UID:</strong> {{ createdUid }}</p>
        <p style="margin-top: 10px;">
          <a href="/login" style="color: #1976d2;">Go to Login Page</a>
        </p>
      </div>
    </div>
  `
})
export class CreateDemoAccountComponent {
    private authService = inject(AuthService);

    loading = false;
    message = '';
    isError = false;
    accountCreated = false;
    createdUid = '';

    async createDemoAccount() {
        this.loading = true;
        this.message = '';
        this.isError = false;
        this.accountCreated = false;

        try {
            // Use the register method from AuthService
            await this.authService.register(
                'demo_customer@example.com',  // email
                'Demo@123',                    // password
                'Demo User'                    // displayName
            );

            // Get the created user's UID
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                this.createdUid = currentUser.uid;
            }

            this.accountCreated = true;
            this.message = '✅ Demo customer account created successfully!';
            this.isError = false;

            console.log('✅ Demo account created:');
            console.log('Email: demo_customer@example.com');
            console.log('Password: Demo@123');
            console.log('Role: customer');
            console.log('UID:', this.createdUid);

        } catch (error: any) {
            this.isError = true;

            if (error.code === 'auth/email-already-in-use') {
                this.message = '⚠️ Demo account already exists! You can login with: demo_customer@example.com / Demo@123';
            } else {
                this.message = `❌ Error: ${error.message}`;
            }

            console.error('Error creating demo account:', error);
        } finally {
            this.loading = false;
        }
    }
}
