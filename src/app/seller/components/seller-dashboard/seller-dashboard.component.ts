import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerService, Property } from '../../services/seller.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seller-dashboard">
      <h1>Seller Dashboard</h1>
      <p>Welcome to your seller dashboard!</p>
      <!-- Add dashboard content here -->
    </div>
  `,
  styles: [`
    .seller-dashboard {
      padding: 2rem;
    }
  `]
})
export class SellerDashboardComponent implements OnInit {
  private sellerService = inject(SellerService);
  private authService = inject(AuthService);

  properties: Property[] = [];

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.sellerService.getSellerProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }
}
