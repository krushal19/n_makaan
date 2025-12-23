import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid bg-primary px-5 d-none d-lg-block">
      <div class="row gx-0">
        <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
          <div class="d-inline-flex align-items-center" style="height: 45px;">
            <small class="me-3 text-light">
              <i class="fa fa-store me-2"></i>Seller Portal - Manage Your Properties
            </small>
          </div>
        </div>
        <div class="col-lg-4 text-center text-lg-end">
          <div class="d-inline-flex align-items-center" style="height: 45px;">
            <small class="text-light">
              <i class="fa fa-phone-alt me-2"></i>Support: +012 345 6789
            </small>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./seller-header.component.scss']
})
export class SellerHeaderComponent { }