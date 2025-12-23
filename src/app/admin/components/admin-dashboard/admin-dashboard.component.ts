import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../core/models/user.model';

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
                  <h4 class="text-white mb-2">Welcome, System Administrator!</h4>
                  <p class="mb-0">Manage users, properties, and system operations</p>
                </div>
              </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="row g-4 mb-4">
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Customers</h6>
                      <h4 class="mb-0 text-primary">{{stats.totalCustomers}}</h4>
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
                      <h4 class="mb-0 text-success">{{stats.totalSellers}}</h4>
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
                      <h4 class="mb-0 text-info">{{stats.totalProperties}}</h4>
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
                      <h4 class="mb-0 text-warning">{{stats.pendingReports}}</h4>
                    </div>
                    <div class="fa fa-exclamation-triangle fa-2x text-warning"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Management Sections -->
            <div class="row g-4 mb-4">
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Customer Management</h6>
                  <div class="d-grid gap-2">
                    <a routerLink="/admin/customers/list" class="btn btn-outline-primary">
                      <i class="fa fa-users me-2"></i>View All Customers
                    </a>
                    <a routerLink="/admin/customers/verification" class="btn btn-outline-info">
                      <i class="fa fa-id-card me-2"></i>ID Verification
                    </a>
                  </div>
                  <hr>
                  <div class="row text-center">
                    <div class="col-6">
                      <small class="text-muted">Active</small>
                      <div class="h5 text-success">{{stats.activeCustomers}}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Blocked</small>
                      <div class="h5 text-danger">{{stats.blockedCustomers}}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Seller Management</h6>
                  <div class="d-grid gap-2">
                    <a routerLink="/admin/sellers/list" class="btn btn-outline-success">
                      <i class="fa fa-store me-2"></i>View All Sellers
                    </a>
                    <a routerLink="/admin/sellers/properties" class="btn btn-outline-warning">
                      <i class="fa fa-building me-2"></i>Property Moderation
                    </a>
                  </div>
                  <hr>
                  <div class="row text-center">
                    <div class="col-6">
                      <small class="text-muted">Active</small>
                      <div class="h5 text-success">{{stats.activeSellers}}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Blocked</small>
                      <div class="h5 text-danger">{{stats.blockedSellers}}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Reports & Verification</h6>
                  <div class="d-grid gap-2">
                    <a routerLink="/admin/reports" class="btn btn-outline-danger">
                      <i class="fa fa-flag me-2"></i>Manage Reports
                    </a>
                    <a routerLink="/admin/verification-center" class="btn btn-outline-secondary">
                      <i class="fa fa-shield-alt me-2"></i>Verification Center
                    </a>
                  </div>
                  <hr>
                  <div class="row text-center">
                    <div class="col-6">
                      <small class="text-muted">New Reports</small>
                      <div class="h5 text-warning">{{stats.newReports}}</div>
                    </div>
                    <div class="col-6">
                      <small class="text-muted">Resolved</small>
                      <div class="h5 text-success">{{stats.resolvedReports}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="row g-4">
              <div class="col-12">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Recent System Activity</h6>
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
                        @for (activity of recentActivities; track activity.date) {
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
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  userProfile: UserProfile | null = null;
  stats = {
    totalCustomers: 1250,
    totalSellers: 85,
    totalProperties: 450,
    pendingReports: 12,
    activeCustomers: 1180,
    blockedCustomers: 70,
    activeSellers: 78,
    blockedSellers: 7,
    newReports: 8,
    resolvedReports: 145
  };
  
  recentActivities = [
    { activity: 'New Customer Registration', user: 'John Doe', userType: 'Customer', date: '2024-01-15', status: 'Completed' },
    { activity: 'Property Report Filed', user: 'Jane Smith', userType: 'Customer', date: '2024-01-15', status: 'Pending' },
    { activity: 'Seller Account Blocked', user: 'Mike Johnson', userType: 'Seller', date: '2024-01-14', status: 'Action Taken' },
    { activity: 'ID Verification Submitted', user: 'Sarah Wilson', userType: 'Seller', date: '2024-01-14', status: 'Under Review' },
    { activity: 'Property Listing Approved', user: 'David Brown', userType: 'Seller', date: '2024-01-13', status: 'Approved' }
  ];

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userProfile = await this.authService.getUserProfile(user.uid);
    }
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success';
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'under review': return 'bg-info';
      case 'action taken': return 'bg-danger';
      default: return 'bg-secondary';
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