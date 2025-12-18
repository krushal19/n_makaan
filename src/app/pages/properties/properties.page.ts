import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PropertyService, Property } from '../../services/property.service';

@Component({
    selector: 'app-properties',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './properties.page.html',
    styles: [`
    .container { padding: 20px; }
    .property-card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
    .btn { cursor: pointer; padding: 5px 10px; margin-right: 5px; }
    .btn-delete { background-color: red; color: white; border: none; }
    .btn-add { background-color: green; color: white; border: none; margin-bottom: 20px; }
  `]
})
export class PropertiesPage implements OnInit {
    private propertyService = inject(PropertyService);

    properties$: Observable<Property[]> | null = null;

    newProperty: Property = {
        title: '',
        price: 0,
        location: ''
    };

    ngOnInit() {
        this.properties$ = this.propertyService.getProperties();
    }

    async addProperty() {
        if (!this.newProperty.title || !this.newProperty.location) return;
        try {
            await this.propertyService.addProperty(this.newProperty);
            this.newProperty = { title: '', price: 0, location: '' }; // Reset form
            alert('Property added successfully!');
        } catch (e) {
            console.error('Error adding property', e);
        }
    }

    async deleteProperty(id: string) {
        if (confirm('Are you sure you want to delete this property?')) {
            try {
                await this.propertyService.deleteProperty(id);
            } catch (e) {
                console.error('Error deleting property', e);
            }
        }
    }
}
