import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PropertyService } from '../../../services/property.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">User Management</h6>
            
            <!-- Add User Form -->
            <div class="bg-white rounded p-4 shadow-sm mb-4">
              <h6 class="mb-3">Add New User</h6>
              
              <form [formGroup]="userForm" (ngSubmit)="addUser()">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Full Name *</label>
                      <input type="text" class="form-control" formControlName="displayName" placeholder="Enter full name">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email *</label>
                      <input type="email" class="form-control" formControlName="email" placeholder="Enter email address">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password *</label>
                      <input type="password" class="form-control" formControlName="password" placeholder="Enter password">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Role *</label>
                      <select class="form-select" formControlName="role">
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Aadhaar Number *</label>
                      <input type="text" class="form-control" formControlName="aadhaarNumber" placeholder="Enter 12-digit Aadhaar number">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Phone Number</label>
                      <input type="tel" class="form-control" formControlName="phoneNumber" placeholder="Enter phone number">
                    </div>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || isCreating">
                  <i class="fa fa-plus me-2"></i>
                  {{ isCreating ? 'Creating User...' : 'Create User' }}
                </button>
              </form>
              
              <!-- Success/Error Messages -->
              <div *ngIf="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
              <div *ngIf="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </div>
            
            <!-- Add Property Form -->
            <div class="bg-white rounded p-4 shadow-sm">
              <h6 class="mb-3">Add Demo Property</h6>
              
              <form [formGroup]="propertyForm" (ngSubmit)="addProperty()">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Property Title *</label>
                      <input type="text" class="form-control" formControlName="title" placeholder="Enter property title">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Price *</label>
                      <input type="number" class="form-control" formControlName="price" placeholder="Enter price">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Location *</label>
                      <input type="text" class="form-control" formControlName="location" placeholder="Enter location">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Type *</label>
                      <select class="form-select" formControlName="type">
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Category *</label>
                      <select class="form-select" formControlName="category">
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Seller Email *</label>
                      <input type="email" class="form-control" formControlName="sellerEmail" placeholder="Enter seller email">
                    </div>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-success" [disabled]="propertyForm.invalid || isCreatingProperty">
                  <i class="fa fa-home me-2"></i>
                  {{ isCreatingProperty ? 'Creating Property...' : 'Create Property' }}
                </button>
              </form>
              
              <!-- Property Success/Error Messages -->
              <div *ngIf="propertySuccessMessage" class="alert alert-success mt-3">
                {{ propertySuccessMessage }}
              </div>
              <div *ngIf="propertyErrorMessage" class="alert alert-danger mt-3">
                {{ propertyErrorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private propertyService = inject(PropertyService);
  private adminService = inject(AdminService);

  isCreating = false;
  isCreatingProperty = false;
  successMessage = '';
  errorMessage = '';
  propertySuccessMessage = '';
  propertyErrorMessage = '';

  userForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['customer', [Validators.required]],
    aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
    phoneNumber: ['']
  });

  propertyForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(1)]],
    location: ['', [Validators.required]],
    type: ['sale', [Validators.required]],
    category: ['apartment', [Validators.required]],
    sellerEmail: ['', [Validators.required, Validators.email]]
  });

  async addUser() {
    if (this.userForm.valid) {
      this.isCreating = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const formData = this.userForm.value;
        console.log('🔍 ADMIN USER MANAGEMENT - Creating user:', formData);
        
        const newUserUid = await this.authService.createUserAsAdmin(
          formData.email,
          formData.password,
          formData.displayName,
          formData.role,
          formData.aadhaarNumber,
          formData.phoneNumber
        );

        console.log('🔍 ADMIN USER MANAGEMENT - User created with UID:', newUserUid);
        this.successMessage = `${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} account created successfully for ${formData.displayName} (UID: ${newUserUid})`;
        this.userForm.reset();
        this.userForm.patchValue({ role: 'customer' });
      } catch (error: any) {
        console.error('🔍 ADMIN USER MANAGEMENT - Error creating user:', error);
        this.errorMessage = this.getErrorMessage(error.code);
      } finally {
        this.isCreating = false;
      }
    }
  }

  async addProperty() {
    if (this.propertyForm.valid) {
      this.isCreatingProperty = true;
      this.propertySuccessMessage = '';
      this.propertyErrorMessage = '';

      try {
        const formData = this.propertyForm.value;
        console.log('🔍 ADMIN PROPERTY MANAGEMENT - Creating property:', formData);
        
        // Find seller by email
        const users = await new Promise<any[]>((resolve, reject) => {
          this.adminService.getAllUsers().subscribe({
            next: (users) => resolve(users),
            error: (error) => reject(error)
          });
        });
        
        const seller = users.find(u => u.email === formData.sellerEmail && u.role === 'seller');
        
        if (!seller) {
          this.propertyErrorMessage = `No seller found with email: ${formData.sellerEmail}`;
          this.isCreatingProperty = false;
          return;
        }

        // Create property with seller information
        const propertyData = {
          title: formData.title,
          description: `${formData.title} - ${formData.category} for ${formData.type}`,
          price: formData.price,
          location: formData.location,
          type: formData.type,
          category: formData.category,
          sellerId: seller.uid,
          sellerName: seller.displayName || seller.email,
          images: [],
          amenities: ['Parking', 'Security'],
          area: 1000,
          bedrooms: formData.category === 'apartment' ? 2 : 3,
          bathrooms: 2,
          legalDocuments: []
        };

        const propertyId = await this.propertyService.createProperty(propertyData);
        
        console.log('🔍 ADMIN PROPERTY MANAGEMENT - Property created with ID:', propertyId);
        this.propertySuccessMessage = `Property "${formData.title}" created successfully for seller ${seller.displayName} (ID: ${propertyId})`;
        this.propertyForm.reset();
        this.propertyForm.patchValue({ type: 'sale', category: 'apartment' });
      } catch (error: any) {
        console.error('🔍 ADMIN PROPERTY MANAGEMENT - Error creating property:', error);
        this.propertyErrorMessage = 'Failed to create property. Please try again.';
      } finally {
        this.isCreatingProperty = false;
      }
    }
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
        return 'Failed to create user. Please try again.';
    }
  }
}