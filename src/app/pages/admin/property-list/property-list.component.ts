import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-admin-property-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './property-list.component.html',
})
export class AdminPropertyListComponent implements OnInit {
    private apiService = inject(ApiService);
    properties: any[] = [];

    ngOnInit() {
        this.apiService.get<any[]>('properties').subscribe(data => {
            this.properties = data || [];
        });
    }

    deleteProperty(id: string) {
        if (confirm('Are you sure?')) {
            this.apiService.delete(`properties/${id}`).subscribe(() => {
                this.properties = this.properties.filter(p => p.id !== id);
            });
        }
    }
}
