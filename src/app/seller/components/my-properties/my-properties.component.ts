import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SellerService, Property } from '../../services/seller.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="my-properties-container">
      <div class="container-fluid">
        <!-- Page Header -->
        <div class="page-header">
          <h1>📋 My Properties</h1>
          <p>Manage and track all your property listings</p>
        </div>

        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filters-grid">
            <div class="filter-group">
              <label for="priceFilter">Price Range</label>
              <select id="priceFilter" [(ngModel)]="filters.priceRange" (change)="applyFilters()" class="form-control">
                <option value="">All Prices</option>
                <option value="0-1000000">Under ₹10L</option>
                <option value="1000000-5000000">₹10L - ₹50L</option>
                <option value="5000000-10000000">₹50L - ₹1Cr</option>
                <option value="10000000-50000000">₹1Cr - ₹5Cr</option>
                <option value="50000000">Above ₹5Cr</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="locationFilter">Location</label>
              <input
                type="text"
                id="locationFilter"
                [(ngModel)]="filters.location"
                (input)="applyFilters()"
                placeholder="Search by location..."
                class="form-control"
              >
            </div>

            <div class="filter-group">
              <label for="typeFilter">Property Type</label>
              <select id="typeFilter" [(ngModel)]="filters.type" (change)="applyFilters()" class="form-control">
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="statusFilter">Status</label>
              <select id="statusFilter" [(ngModel)]="filters.status" (change)="applyFilters()" class="form-control">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div class="filter-actions">
            <button (click)="clearFilters()" class="btn btn-secondary">Clear Filters</button>
          </div>
        </div>

        <!-- Results Summary -->
        <div class="results-summary" *ngIf="filteredProperties.length !== allProperties.length">
          <p>Showing {{ filteredProperties.length }} of {{ allProperties.length }} properties</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading your properties...</p>
        </div>

        <!-- Properties Grid -->
        <div *ngIf="!isLoading" class="properties-grid">
          <div *ngFor="let property of filteredProperties" class="property-card">
            <div class="property-image">
              <img [src]="property.images?.[0] || '/assets/images/default-property.jpg'" [alt]="property.title">
            </div>
            <div class="property-info">
              <h4>{{ property.title }}</h4>
              <p class="property-type">{{ property.type | titlecase }}</p>
              <p class="location">📍 {{ property.location }}</p>
              <p class="price">💰 ₹{{ property.price | number }}</p>
              <span class="status" [class]="property.status || 'pending'">
                {{ property.status || 'Pending' | titlecase }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty States -->
        <div *ngIf="!isLoading && allProperties.length === 0" class="empty-state">
          <div class="empty-icon">🏠</div>
          <h3>No Properties Yet</h3>
          <p>You haven't added any properties yet. Start by adding your first property!</p>
          <a routerLink="/seller/add-property" class="btn btn-primary">Add Your First Property</a>
        </div>

        <div *ngIf="!isLoading && allProperties.length > 0 && filteredProperties.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No Properties Match Your Filters</h3>
          <p>Try adjusting your filters to see more results.</p>
          <button (click)="clearFilters()" class="btn btn-secondary">Clear Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-properties-container {
      padding: 2rem 0;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .page-header p {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .filters-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .filter-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .results-summary {
      background: #e9ecef;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .results-summary p {
      margin: 0;
      color: #495057;
      font-weight: 500;
    }

    .properties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .property-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .property-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .property-image {
      height: 200px;
      overflow: hidden;
    }

    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .property-info {
      padding: 1.5rem;
    }

    .property-info h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .property-type {
      color: #667eea;
      font-weight: 500;
      margin: 0.25rem 0;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .location, .price {
      margin: 0.25rem 0;
      color: #666;
      font-size: 0.95rem;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      margin-top: 0.5rem;
    }

    .status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .status.active {
      background: #d4edda;
      color: #155724;
    }

    .status.sold {
      background: #f8d7da;
      color: #721c24;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }

      .properties-grid {
        grid-template-columns: 1fr;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .filters-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class MyPropertiesComponent implements OnInit {
  private sellerService = inject(SellerService);
  private authService = inject(AuthService);

  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  isLoading = true;

  filters = {
    priceRange: '',
    location: '',
    type: '',
    status: ''
  };

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.isLoading = true;
    this.sellerService.getSellerProperties().subscribe({
      next: (properties) => {
        this.allProperties = properties;
        this.filteredProperties = [...properties];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredProperties = this.allProperties.filter(property => {
      // Price filter
      if (this.filters.priceRange) {
        const [min, max] = this.filters.priceRange.split('-').map(Number);
        if (max) {
          if (property.price < min || property.price > max) return false;
        } else {
          if (property.price < min) return false;
        }
      }

      // Location filter
      if (this.filters.location) {
        const locationMatch = property.location.toLowerCase().includes(this.filters.location.toLowerCase());
        if (!locationMatch) return false;
      }

      // Type filter
      if (this.filters.type) {
        if (property.type !== this.filters.type) return false;
      }

      // Status filter
      if (this.filters.status) {
        if ((property.status || 'pending') !== this.filters.status) return false;
      }

      return true;
    });
  }

  clearFilters() {
    this.filters = {
      priceRange: '',
      location: '',
      type: '',
      status: ''
    };
    this.filteredProperties = [...this.allProperties];
  }
}
