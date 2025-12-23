import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Seller Management</h6>
            <div class="bg-white rounded p-4 shadow-sm">
              <p>Seller Management functionality will be implemented here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./seller-management.component.scss']
})
export class SellerManagementComponent { }
