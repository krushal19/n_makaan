import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService, AdminStats, SystemActivity } from '../../../services/admin.service';
import { UserProfile } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Admin Dashboard</h6>
            
            <!-- Welcome Section -->
            <div class="row g-4 mb-4">
              <div class="col-12">
                <div class="bg-primary rounded p-4 text-white">
                  <h4 class="text-white mb-2">Welcome, {{userProfile?.displayName || 'Administrator'}}!</h4>
                  <p class="mb-0">Manage users, properties, and system operations</p>
                </div>
              </div>
            </div>
            
            <!-- Dynamic Stats Cards -->
            <div class="row g-4 mb-4">
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Customers</h6>
                      <h4 class="mb-0 text-primary">{{stats?.totalCustomers || 0}}</h4>
                    </div>
                    <div class="fa fa-users fa-2x text-primary"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Sellers</h6>
                      <h4 class="mb-0 text-success">{{stats?.totalSellers || 0}}</h4>
                    </div>
                    <div class="fa fa-store fa-2x text-success"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Properties</h6>
                      <h4 class="mb-0 text-info">{{stats?.totalProperties || 0}}</h4>
                    </div>
                    <div class="fa fa-building fa-2x text-info"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Pending Reports</h6>
                      <h4 class="mb-0 text-warning">{{stats?.pendingReports || 0}}</h4>
                    </div>
                    <div class="fa fa-exclamation-triangle fa-2x text-warning"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Properties Section -->
            <div class="row g-4 mb-4">
              <div class="col-12">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Recent Properties Added</h6>
                  @if (recentProperties && recentProperties.length > 0) {
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Property Title</th>
                            <th>Seller</th>
                            <th>Price</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Date Added</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (property of recentProperties; track property.id) {
                            <tr>
                              <td>{{property.title}}</td>
                              <td>{{property.sellerName || 'Unknown'}}</td>
                              <td>₹{{property.price | number}}</td>
                              <td>{{property.location}}</td>
                              <td>
                                <span class="badge" [ngClass]="property.type === 'sale' ? 'bg-success' : 'bg-info'">
                                  {{property.type | titlecase}}
                                </span>
                              </td>
                              <td>{{property.createdAt?.toDate() | date:'shortDate'}}</td>
                              <td>
                                <span class="badge" [ngClass]="property.isVerified ? 'bg-success' : 'bg-warning'">
                                  {{property.isVerified ? 'Verified' : 'Pending'}}
                                </span>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  } @else {
                    <div class="text-center py-4">
                      <i class="fa fa-building fa-3x text-muted mb-3"></i>
                      <p class="text-muted">No properties found. Properties will appear here once sellers start adding them.</p>
                    </div>
                  }
                </div>
              </div>
            </div>
            
            <!-- Management Sections with Dynamic Data -->
            <div class="row g-4 mb-4">
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Customer Management</h6>
                  <div class="d-grid gap-2">
                    <a routerLink="/admin/customer-management" class="btn btn-outline-primary">
                      <i class="fa fa-users me-2"></i>View All Customers
                    </a>
                    <a routerLink="/admin/verification-center" class="btn btn-outline-info">
                      <i class="fa fa-id-card me-2"></i>ID Verification
                    </a>
                  </div>
                  <hr>
                  <div class="row text-center">
                    <div class="col-6">
                      <small class="text-muted">Active</small>
                      <div class="h5 text-success">{{stats?.activeCustomers || 0}}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Blocked</small>
                      <div class="h5 text-danger">{{stats?.blockedCustomers || 0}}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Seller Management</h6>
                  <div class="d-grid gap-2">
                    <a routerLink="/admin/seller-management" class="btn btn-outline-success">
                      <i class="fa fa-store me-2"></i>View All Sellers
                    </a>
                    <button class="btn btn-outline-warning" (click)="viewProperties()">
                      <i class="fa fa-building me-2"></i>Property Moderation
                    </button>
                  </div>
                  <hr>
                  <div class="row text-center">
                    <div class="col-6">
                      <small class="text-muted">Active</small>
                      <div class="h5 text-success">{{stats?.activeSellers || 0}}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Blocked</small>
                      <div class="h5 text-danger">{{stats?.blockedSellers || 0}}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Reports & Verification</h6>
                  <div class="d-grid gap-2">
                    <button class="btn btn-outline-danger" (click)="viewReports()">
                      <i class="fa fa-flag me-2"></i>Manage Reports
                    </button>
                    <a routerLink="/admin/verification-center" class="btn btn-outline-secondary">
                      <i class="fa fa-shield-alt me-2"></i>Verification Center
                    </a>
                  </div>
                  <hr>
                  <div class="row text-center">
                    <div class="col-6">
                      <small class="text-muted">New Reports</small>
                      <div class="h5 text-warning">{{stats?.newReports || 0}}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Resolved</small>
                      <div class="h5 text-success">{{stats?.resolvedReports || 0}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Real-time Activity Feed -->
            <div class="row g-4">
              <div class="col-12">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Recent System Activity</h6>
                  @if (recentActivities && recentActivities.length > 0) {
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Activity</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (activity of recentActivities; track activity.id) {
                            <tr>
                              <td>{{activity.activity}}</td>
                              <td>{{activity.user}}</td>
                              <td>
                                <span class="badge" [ngClass]="getUserTypeClass(activity.userType)">
                                  {{activity.userType}}
                                </span>
                              </td>
                              <td>{{activity.date}}</td>
                              <td>
                                <span class="badge" [ngClass]="getStatusClass(activity.status)">
                                  {{activity.status}}
                                </span>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  } @else {
                    <div class="text-center py-4">
                      <p class="text-muted">No recent activities found.</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  
  userProfile: UserProfile | null = null;
  stats: AdminStats | null = null;
  recentActivities: SystemActivity[] = [];
  recentProperties: any[] = [];
  
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🔍 ADMIN DASHBOARD - Initializing...');
    
    // Load user profile
    this.subscriptions.push(
      this.authService.getCurrentUserProfile().subscribe({
        next: (profile) => {
          console.log('🔍 ADMIN DASHBOARD - Profile loaded:', profile);
          this.userProfile = profile;
        },
        error: (error) => {
          console.error('🔍 ADMIN DASHBOARD - Error fetching user profile:', error);
        }
      })
    );

    // Load dynamic stats
    this.subscriptions.push(
      this.adminService.getAdminStats().subscribe({
        next: (stats) => {
          console.log('🔍 ADMIN DASHBOARD - Stats loaded:', stats);
          this.stats = stats;
        },
        error: (error) => {
          console.error('🔍 ADMIN DASHBOARD - Error fetching admin stats:', error);
        }
      })
    );

    // Load recent activities
    this.subscriptions.push(
      this.adminService.getRecentActivities().subscribe({
        next: (activities) => {
          console.log('🔍 ADMIN DASHBOARD - Activities loaded:', activities);
          this.recentActivities = activities;
        },
        error: (error) => {
          console.error('🔍 ADMIN DASHBOARD - Error fetching recent activities:', error);
        }
      })
    );

    // Load recent properties
    this.subscriptions.push(
      this.adminService.getAllProperties().subscribe({
        next: (properties) => {
          console.log('🔍 ADMIN DASHBOARD - Properties loaded:', properties);
          // Get the 5 most recent properties
          this.recentProperties = properties
            .sort((a, b) => {
              const dateA = a.createdAt?.seconds || 0;
              const dateB = b.createdAt?.seconds || 0;
              return dateB - dateA;
            })
            .slice(0, 5);
          console.log('🔍 ADMIN DASHBOARD - Recent properties:', this.recentProperties);
        },
        error: (error) => {
          console.error('🔍 ADMIN DASHBOARD - Error fetching properties:', error);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  viewReports() {
    // Navigate to reports management
    console.log('Navigate to reports management');
  }

  viewProperties() {
    // Navigate to property moderation
    console.log('Navigate to property moderation');
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': 
      case 'approved': 
      case 'verified': 
        return 'bg-success';
      case 'pending': 
      case 'pending verification': 
        return 'bg-warning';
      case 'under review': 
        return 'bg-info';
      case 'action taken': 
      case 'resolved': 
        return 'bg-primary';
      default: 
        return 'bg-secondary';
    }
  }
  
  getUserTypeClass(userType: string): string {
    switch (userType.toLowerCase()) {
      case 'customer': return 'bg-primary';
      case 'seller': return 'bg-success';
      case 'admin': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}