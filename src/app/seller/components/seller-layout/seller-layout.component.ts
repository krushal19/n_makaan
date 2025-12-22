import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SellerNavbarComponent } from '../seller-navbar/seller-navbar.component';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [RouterOutlet, SellerNavbarComponent],
  template: `
    <app-seller-navbar></app-seller-navbar>
    <main class="seller-main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .seller-main-content {
      padding: 20px;
      min-height: calc(100vh - 80px);
      background-color: #f8f9fa;
    }
  `]
})
export class SellerLayoutComponent {

}
