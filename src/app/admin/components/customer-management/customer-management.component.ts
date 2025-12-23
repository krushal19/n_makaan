import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { UserProfile } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Customer Management</h6>
            
            <!-- Stats Cards -->
            <div class="row g-4 mb-4">
              <div class="col-md-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Total Customers</h6>
                      <h4 class="mb-0 text-primary">{{customers.length}}</h4>
                    </div>
                    <div class="fa fa-users fa-2x text-primary"></div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Active</h6>
                      <h4 class="mb-0 text-success">{{getActiveCustomers()}}</h4>
                    </div>
                    <div class="fa fa-check-circle fa-2x text-success"></div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Blocked</h6>
                      <h4 class="mb-0 text-danger">{{getBlockedCustomers()}}</h4>
                    </div>
                    <div class="fa fa-ban fa-2x text-danger"></div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="bg-white rounded p-4 shadow-sm">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-2">Verified</h6>
                      <h4 class="mb-0 text-info">{{getVerifiedCustomers()}}</h4>
                    </div>
                    <div class="fa fa-shield-alt fa-2x text-info"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Customer List -->
            <div class="bg-white rounded p-4 shadow-sm">
              <h6 class="mb-3">All Customers</h6>
              @if (customers && customers.length > 0) {
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Aadhaar</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (customer of customers; track customer.uid) {
                        <tr>
                          <td>{{customer.displayName || 'N/A'}}</td>
                          <td>{{customer.email}}</td>
                          <td>{{customer.phoneNumber || 'N/A'}}</td>
                          <td>{{customer.aadhaarNumber || 'N/A'}}</td>
                          <td>
                            <span class="badge" [ngClass]="getStatusClass(customer)">
                              {{getStatusText(customer)}}
                            </span>
                          </td>
                          <td>{{formatDate(customer.createdAt)}}</td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <button 
                                class="btn btn-outline-primary" 
                                (click)="viewCustomer(customer)"
                                title="View Details">
                                <i class="fa fa-eye"></i>
                              </button>
                              <button 
                                class="btn" 
                                [ngClass]="customer.isBlocked ? 'btn-outline-success' : 'btn-outline-danger'"
                                (click)="toggleBlock(customer)"
                                [title]="customer.isBlocked ? 'Unblock Customer' : 'Block Customer'">
                                <i class="fa" [ngClass]="customer.isBlocked ? 'fa-unlock' : 'fa-ban'"></i>
                              </button>
                              <button 
                                class="btn btn-outline-warning" 
                                (click)="resetPassword(customer)"
                                title="Reset Password">
                                <i class="fa fa-key"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <div class="text-center py-4">
                  <p class="text-muted">No customers found.</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  
  customers: UserProfile[] = [];
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    // Load customers with real-time updates
    this.subscriptions.push(
      this.adminService.getUsersByRole('customer').subscribe({
        next: (customers) => {
          this.customers = customers;
        },
        error: (error) => {
          console.error('Error fetching customers:', error);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getActiveCustomers(): number {
    return this.customers.filter(c => !c.isBlocked).length;
  }

  getBlockedCustomers(): number {
    return this.customers.filter(c => c.isBlocked).length;
  }

  getVerifiedCustomers(): number {
    return this.customers.filter(c => c.isVerified).length;
  }

  getStatusClass(customer: UserProfile): string {
    if (customer.isBlocked) return 'bg-danger';
    if (customer.isVerified) return 'bg-success';
    return 'bg-warning';
  }

  getStatusText(customer: UserProfile): string {
    if (customer.isBlocked) return 'Blocked';
    if (customer.isVerified) return 'Verified';
    return 'Pending';
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  viewCustomer(customer: UserProfile) {
    console.log('View customer details:', customer);
    // Implement customer details modal or navigation
  }

  async toggleBlock(customer: UserProfile) {
    try {
      await this.adminService.toggleUserBlock(customer.uid, !customer.isBlocked);
      console.log(`Customer ${customer.isBlocked ? 'unblocked' : 'blocked'} successfully`);
    } catch (error) {
      console.error('Error toggling customer block status:', error);
    }
  }

  async resetPassword(customer: UserProfile) {
    try {
      await this.adminService.updateUserPassword(customer.uid, 'newPassword123');
      console.log('Password reset initiated for customer:', customer.email);
    } catch (error) {
      console.error('Error resetting customer password:', error);
    }
  }
}