import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-admin-seller-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './seller-list.component.html',
})
export class AdminSellerListComponent implements OnInit {
    private apiService = inject(ApiService);
    sellers: any[] = [];

    ngOnInit() {
        this.apiService.get<any[]>('users').subscribe(data => {
            // Filter for sellers - ideally backend does this
            this.sellers = (data || []).filter(u => u.role === 'seller');
        });
    }

    deleteSeller(uid: string) {
        if (confirm('Are you sure? Deleting a seller might delete their properties.')) {
            this.sellers = this.sellers.filter(u => u.uid !== uid);
            // Call API to delete
        }
    }
}
