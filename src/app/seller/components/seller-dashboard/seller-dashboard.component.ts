import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <!-- CLEAR IDENTIFICATION FOR TESTING -->
            <div class="alert alert-success text-center mb-4">
              <h3 class="mb-0">🏪 SELLER PANEL ACTIVE</h3>
              <p class="mb-0" *ngIf="userProfile">Welcome, {{ userProfile.displayName || 'Seller' }}! (Role: {{ userProfile.role | uppercase }})</p>
            </div>
            
            <h6 class="mb-4">Seller Dashboard</h6>
            
            <!-- Welcome Section -->
            <div class="row g-4 mb-4">
              <div class="col-12">
                <div class="bg-primary rounded p-4 text-white">
                  <h4 class="text-white mb-2">Welcome, {{userProfile?.displayName || 'Seller'}}!</h4>
                  <p class="mb-0">Manage your properties and grow your business</p>
                </div>
              </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="row g-4 mb-4">
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Properties</h6>
                      <h4 class="mb-0 text-primary">{{stats.totalProperties}}</h4>
                    </div>
                    <div class="fa fa-building fa-2x text-primary"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Active Listings</h6>
                      <h4 class="mb-0 text-success">{{stats.activeListings}}</h4>
                    </div>
                    <div class="fa fa-check-circle fa-2x text-success"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Inquiries</h6>
                      <h4 class="mb-0 text-info">{{stats.totalInquiries}}</h4>
                    </div>
                    <div class="fa fa-envelope fa-2x text-info"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Monthly Earnings</h6>
                      <h4 class="mb-0 text-warning">₹{{stats.monthlyEarnings}}</h4>
                    </div>
                    <div class="fa fa-rupee-sign fa-2x text-warning"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="row g-4 mb-4">
              <div class="col-12">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Quick Actions</h6>
                  <div class="row g-3">
                    <div class="col-md-3">
                      <a routerLink="/seller/add-property" class="btn btn-primary w-100">
                        <i class="fa fa-plus me-2"></i>Add New Property
                      </a>
                    </div>
                    <div class="col-md-3">
                      <a routerLink="/seller/my-properties" class="btn btn-outline-primary w-100">
                        <i class="fa fa-building me-2"></i>View Properties
                      </a>
                    </div>
                    <div class="col-md-3">
                      <a routerLink="/seller/my-customers" class="btn btn-outline-success w-100">
                        <i class="fa fa-users me-2"></i>My Customers
                      </a>
                    </div>
                    <div class="col-md-3">
                      <a routerLink="/seller/profile" class="btn btn-outline-info w-100">
                        <i class="fa fa-user me-2"></i>Update Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Properties -->
            <div class="row g-4">
              <div class="col-12">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Recent Properties</h6>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Type</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (property of recentProperties; track property.title) {
                          <tr>
                            <td>{{property.title}}</td>
                            <td>{{property.type}}</td>
                            <td>₹{{property.price}}</td>
                            <td>
                              <span class="badge" [ngClass]="getStatusClass(property.status)">
                                {{property.status}}
                              </span>
                            </td>
                            <td>
                              <button class="btn btn-sm btn-outline-primary me-1">
                                <i class="fa fa-eye"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fa fa-edit"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  userProfile: UserProfile | null = null;
  stats = {
    totalProperties: 12,
    activeListings: 8,
    totalInquiries: 45,
    monthlyEarnings: 85000
  };
  
  recentProperties = [
    { title: 'Luxury Villa Downtown', type: 'Sale', price: '2,50,00,000', status: 'Active' },
    { title: 'Modern Apartment', type: 'Rent', price: '25,000', status: 'Active' },
    { title: 'Family House', type: 'Sale', price: '1,80,00,000', status: 'Sold' },
    { title: 'Commercial Space', type: 'Rent', price: '50,000', status: 'Pending' }
  ];

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.authService.getUserProfile(user.uid).subscribe({
        next: (profile) => {
          this.userProfile = profile;
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
        }
      });
    }
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'sold': return 'bg-primary';
      case 'inactive': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }
}