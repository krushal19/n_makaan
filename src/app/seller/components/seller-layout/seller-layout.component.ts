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
    <main class="seller-main">
      <router-outlet></router-outlet>
    </main>
    <app-seller-footer></app-seller-footer>
  `,
  styleUrls: ['./seller-layout.component.scss']
})
export class SellerLayoutComponent { }