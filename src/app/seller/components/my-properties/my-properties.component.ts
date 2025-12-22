import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerService, Property } from '../../services/seller.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-properties">
      <h1>My Properties</h1>
      <div class="properties-list">
        <div *ngFor="let property of properties" class="property-item">
          <h3>{{ property.title }}</h3>
          <p>{{ property.location }}</p>
          <p>{{ property.price | currency }}</p>
        </div>
        <div *ngIf="properties.length === 0" class="no-properties">
          <p>No properties found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-properties {
      padding: 2rem;
    }
    .properties-list {
      display: grid;
      gap: 1rem;
    }
    .property-item {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 8px;
    }
    .no-properties {
      text-align: center;
      color: #666;
    }
  `]
})
export class MyPropertiesComponent implements OnInit {
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
