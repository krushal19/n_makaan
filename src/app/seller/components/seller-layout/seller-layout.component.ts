import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SellerHeaderComponent } from '../seller-header/seller-header.component';
import { SellerNavbarComponent } from '../seller-navbar/seller-navbar.component';
import { SellerFooterComponent } from '../seller-footer/seller-footer.component';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SellerHeaderComponent, SellerNavbarComponent, SellerFooterComponent],
  template: `
    <app-seller-header></app-seller-header>
    <app-seller-navbar></app-seller-navbar>
    <main class="seller-main page-wrapper">
      <router-outlet></router-outlet>
    </main>
    <app-seller-footer></app-seller-footer>
  `,
  styles: [`
    .page-wrapper {
      min-height: calc(100vh - 160px);
      padding-top: 80px; /* Space for fixed navbar */
    }
    .seller-main {
      background-color: #f8f9fa;
    }
  `]
})
export class SellerLayoutComponent { }