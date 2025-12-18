/**
 * ADMIN ACCOUNT CREATION SCRIPT
 * 
 * This script creates an admin account in Firebase Authentication and Firestore.
 * 
 * Admin Account Details:
 * - Name: Admin User
 * - Email: admin@makaan.com
 * - Password: Admin@123456
 * - Role: admin
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>Create Admin Account</h2>
      <p>This will create an admin account for accessing the admin panel.</p>
      
      <button 
        (click)="createAdminAccount()" 
        [disabled]="loading"
        style="padding: 15px 30px; font-size: 16px; cursor: pointer; background: #667eea; color: white; border: none; border-radius: 8px;">
        {{ loading ? 'Creating Admin Account...' : 'Create Admin Account' }}
      </button>
      
      <div *ngIf="message" 
           [style.color]="isError ? 'red' : 'green'" 
           style="margin-top: 20px; padding: 15px; border-radius: 8px; background: #f8f9fa;">
        {{ message }}
      </div>
      
      <div *ngIf="accountCreated" style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 10px; border-left: 4px solid #4caf50;">
        <h3>✅ Admin Account Created Successfully!</h3>
        <div style="margin-top: 15px;">
          <p><strong>Email:</strong> admin@makaan.com</p>
          <p><strong>Password:</strong> Admin@123456</p>
          <p><strong>Role:</strong> Admin</p>
          <p><strong>UID:</strong> {{ createdUid }}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
          <h4>🔐 Admin Panel Access:</h4>
          <p>1. Go to <a href="/login" style="color: #1976d2;">/login</a></p>
          <p>2. Login with the credentials above</p>
          <p>3. You will be redirected to <a href="/admin" style="color: #1976d2;">/admin</a></p>
        </div>
        <div style="margin-top: 15px; padding: 15px; background: #f8d7da; border-radius: 8px;">
          <h4>⚠️ Security Note:</h4>
          <p>Please change the admin password after first login for security.</p>
        </div>
      </div>
    </div>
  `
})
export class CreateAdminComponent {
  private authService = inject(AuthService);

  loading = false;
  message = '';
  isError = false;
  accountCreated = false;
  createdUid = '';

  async createAdminAccount() {
    this.loading = true;
    this.message = '';
    this.isError = false;
    this.accountCreated = false;

    try {
      // Create admin user
      await this.authService.register(
        'admin@makaan.com',     // email
        'Admin@123456',         // password
        'Admin User',           // displayName
        'admin'                 // role
      );

      // Get the created user's UID
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.createdUid = currentUser.uid;
      }

      this.accountCreated = true;
      this.message = '✅ Admin account created successfully!';
      this.isError = false;

      console.log('✅ Admin account created:');
      console.log('Email: admin@makaan.com');
      console.log('Password: Admin@123456');
      console.log('Role: admin');
      console.log('UID:', this.createdUid);

    } catch (error: any) {
      this.isError = true;

      if (error.code === 'auth/email-already-in-use') {
        this.message = '⚠️ Admin account already exists! You can login with: admin@makaan.com / Admin@123456';
        this.accountCreated = true; // Show login info even if account exists
      } else {
        this.message = `❌ Error: ${error.message}`;
      }

      console.error('Error creating admin account:', error);
    } finally {
      this.loading = false;
    }
  }
}