import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { HeaderComponent } from '../../../components/shared/header/header';
import { FooterComponent } from '../../../components/shared/footer/footer';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.scss']
})
export class PropertyListComponent {
  private apiService = inject(ApiService);
  properties: any[] = [];

  ngOnInit() {
    this.apiService.get<any>('properties').subscribe(data => {
      this.properties = data || [];
    });
  }
}
