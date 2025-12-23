import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-6 col-md-6">
            <h5 class="text-white mb-4">Seller Support</h5>
            <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+012 345 6789</p>
            <p class="mb-2"><i class="fa fa-envelope me-3"></i>seller-support@makaan.com</p>
          </div>
          <div class="col-lg-6 col-md-6">
            <h5 class="text-white mb-4">Quick Links</h5>
            <a class="btn btn-link text-white-50" routerLink="/seller/dashboard">Dashboard</a>
            <a class="btn btn-link text-white-50" routerLink="/seller/add-property">Add Property</a>
            <a class="btn btn-link text-white-50" routerLink="/seller/my-properties">My Properties</a>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="copyright">
          <div class="row">
            <div class="col-md-12 text-center">
              &copy; <a class="border-bottom text-primary" href="#">Makaan</a> Seller Portal, All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./seller-footer.component.scss']
})
export class SellerFooterComponent { }