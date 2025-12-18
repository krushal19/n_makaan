import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-seller-property-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './property-list.component.html',
})
export class SellerPropertyListComponent implements OnInit {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    properties: any[] = [];

    ngOnInit() {
        // Subscribe to current user to get seller ID
        this.authService.user$.subscribe(async (user) => {
            if (user) {
                this.apiService.get<any[]>('properties').subscribe(data => {
                    // Mock filtering - in production, backend should filter by sellerId
                    this.properties = data.filter(p => p.sellerId === user.uid || !p.sellerId);
                });
            }
        });
    }

    deleteProperty(id: string) {
        if (confirm('Are you sure you want to delete this property?')) {
            this.apiService.delete(`properties/${id}`).subscribe(() => {
                this.properties = this.properties.filter(p => p.id !== id);
            });
        }
    }
}
