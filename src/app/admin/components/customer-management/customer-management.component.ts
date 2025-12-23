import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-management',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Customer Management</h6>
            <div class="bg-white rounded p-4 shadow-sm">
              <p>Customer management features will be implemented here.</p>
              <div class="row g-3">
                <div class="col-md-4">
                  <a routerLink="/admin/customers/list" class="btn btn-primary w-100">
                    <i class="fa fa-users me-2"></i>View All Customers
                  </a>
                </div>
                <div class="col-md-4">
                  <a routerLink="/admin/customers/verification" class="btn btn-outline-primary w-100">
                    <i class="fa fa-id-card me-2"></i>ID Verification
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent { }