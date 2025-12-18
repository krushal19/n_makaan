import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-seller-add-property',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-property.component.html',
})
export class SellerAddPropertyComponent {
    private fb = inject(FormBuilder);
    private apiService = inject(ApiService);
    private router = inject(Router);

    propertyForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        address: ['', Validators.required],
        type: ['sell', Validators.required], // sell or rent
        category: ['Apartment', Validators.required],
        sqft: ['', Validators.required],
        beds: ['', Validators.required],
        bath: ['', Validators.required],
        img: ['assets/img/property-1.jpg'] // Default or upload
    });

    onSubmit() {
        if (this.propertyForm.valid) {
            this.apiService.post('properties', this.propertyForm.value).subscribe(() => {
                this.router.navigate(['/seller/properties']);
            });
        }
    }
}
