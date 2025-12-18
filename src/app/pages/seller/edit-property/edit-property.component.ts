import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-seller-edit-property',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './edit-property.component.html',
})
export class SellerEditPropertyComponent implements OnInit {
    private fb = inject(FormBuilder);
    private apiService = inject(ApiService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    propertyId = '';
    propertyForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        address: ['', Validators.required],
        type: ['sell', Validators.required],
        category: ['Apartment', Validators.required],
        sqft: ['', Validators.required],
        beds: ['', Validators.required],
        bath: ['', Validators.required],
        img: ['assets/img/property-1.jpg']
    });

    ngOnInit() {
        this.propertyId = this.route.snapshot.paramMap.get('id') || '';
        if (this.propertyId) {
            this.apiService.get<any>(`properties/${this.propertyId}`).subscribe(data => {
                if (data) {
                    this.propertyForm.patchValue(data);
                }
            });
        }
    }

    onSubmit() {
        if (this.propertyForm.valid) {
            this.apiService.put(`properties/${this.propertyId}`, this.propertyForm.value).subscribe(() => {
                this.router.navigate(['/seller/properties']);
            });
        }
    }
}
