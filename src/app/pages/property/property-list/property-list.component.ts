import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.scss']
})
export class PropertyListComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  properties: any[] = [];
  filteredProperties: any[] = [];
  selectedType = '';

  ngOnInit() {
    this.apiService.get<any>('properties').subscribe(data => {
      this.properties = data || [];
      this.filteredProperties = this.properties;
      this.route.queryParams.subscribe(params => {
        if (params['type']) {
          this.selectedType = params['type'];
          this.filterProperties();
        }
      });
    });
  }

  filterProperties() {
    if (this.selectedType) {
      this.filteredProperties = this.properties.filter(p => p.category === this.selectedType);
    } else {
      this.filteredProperties = this.properties;
    }
  }
}
