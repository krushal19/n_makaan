import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <h1 class="mb-4">Add New Property</h1>

          <div class="card">
            <div class="card-body">
              <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="title" class="form-label">Property Title</label>
                    <input type="text" class="form-control" id="title" formControlName="title" required>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="type" class="form-label">Property Type</label>
                    <select class="form-select" id="type" formControlName="type" required>
                      <option value="">Select Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condominium">Condominium</option>
                      <option value="building">Building</option>
                      <option value="luxury">Luxury</option>
                      <option value="housing">Housing</option>
                      <option value="neighborhood">Neighborhood</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="price" class="form-label">Price</label>
                    <input type="number" class="form-control" id="price" formControlName="price" required>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="location" formControlName="location" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea class="form-control" id="description" rows="4" formControlName="description" required></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="propertyForm.invalid || isSubmitting">
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ isSubmitting ? 'Adding...' : 'Add Property' }}
                  </button>
                  <button type="button" class="btn btn-secondary" routerLink="/seller/dashboard">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .card-body {
      padding: 2rem;
    }
  `]
})
export class AddPropertyComponent {
  private fb = inject(FormBuilder);
  private sellerService = inject(SellerService);
  private router = inject(Router);

  propertyForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.isSubmitting = true;

      this.sellerService.addProperty(this.propertyForm.value).subscribe({
        next: (propertyId) => {
          this.isSubmitting = false;
          alert('Property added successfully!');
          this.router.navigate(['/seller/my-properties']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding property:', error);
          alert('Error adding property. Please try again.');
        }
      });
    }
  }
}
