import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Customer Dashboard</h6>
            
            <!-- Welcome Section -->
            <div class="row g-4 mb-4">
              <div class="col-12">
                <div class="bg-primary rounded p-4 text-white">
                  <h4 class="text-white mb-2">Welcome back, {{userProfile?.displayName || 'Customer'}}!</h4>
                  <p class="mb-0">Find your dream property with Makaan</p>
                </div>
              </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="row g-4 mb-4">
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Saved Properties</h6>
                      <h4 class="mb-0 text-primary">{{stats.savedProperties}}</h4>
                    </div>
                    <div class="fa fa-heart fa-2x text-primary"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Active Inquiries</h6>
                      <h4 class="mb-0 text-success">{{stats.activeInquiries}}</h4>
                    </div>
                    <div class="fa fa-envelope fa-2x text-success"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Properties Viewed</h6>
                      <h4 class="mb-0 text-info">{{stats.propertiesViewed}}</h4>
                    </div>
                    <div class="fa fa-eye fa-2x text-info"></div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6 col-xl-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Profile Complete</h6>
                      <h4 class="mb-0 text-warning">{{stats.profileComplete}}%</h4>
                    </div>
                    <div class="fa fa-user fa-2x text-warning"></div>
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
                      <a routerLink="/customer/browse" class="btn btn-primary w-100">
                        <i class="fa fa-search me-2"></i>Browse Properties
                      </a>
                    </div>
                    <div class="col-md-3">
                      <a routerLink="/customer/saved-properties" class="btn btn-outline-primary w-100">
                        <i class="fa fa-heart me-2"></i>View Saved
                      </a>
                    </div>
                    <div class="col-md-3">
                      <a routerLink="/customer/inquiries" class="btn btn-outline-success w-100">
                        <i class="fa fa-envelope me-2"></i>My Inquiries
                      </a>
                    </div>
                    <div class="col-md-3">
                      <a routerLink="/customer/profile" class="btn btn-outline-info w-100">
                        <i class="fa fa-user me-2"></i>Update Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="row g-4">
              <div class="col-12">
                <div class="bg-white rounded p-4 shadow-sm">
                  <h6 class="mb-3">Recent Activity</h6>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Activity</th>
                          <th>Property</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (activity of recentActivities; track activity.date) {
                          <tr>
                            <td>{{activity.type}}</td>
                            <td>{{activity.property}}</td>
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
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  userProfile: UserProfile | null = null;
  stats = {
    savedProperties: 5,
    activeInquiries: 3,
    propertiesViewed: 24,
    profileComplete: 85
  };
  
  recentActivities = [
    { type: 'Property Viewed', property: 'Luxury Villa in Downtown', date: '2024-01-15', status: 'Completed' },
    { type: 'Inquiry Sent', property: 'Modern Apartment', date: '2024-01-14', status: 'Pending' },
    { type: 'Property Saved', property: 'Family House', date: '2024-01-13', status: 'Active' },
    { type: 'Profile Updated', property: '-', date: '2024-01-12', status: 'Completed' }
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
      case 'pending': return 'bg-warning';
      case 'active': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }
}