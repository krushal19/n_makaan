import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { CustomerNavbarComponent } from '../customer-navbar/customer-navbar.component';
import { CustomerFooterComponent } from '../customer-footer/customer-footer.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, CustomerHeaderComponent, CustomerNavbarComponent, CustomerFooterComponent],
  template: `
    <app-customer-header></app-customer-header>
    <app-customer-navbar></app-customer-navbar>
    <main class="customer-main">
      <router-outlet></router-outlet>
    </main>
    <app-customer-footer></app-customer-footer>
  `,
  styleUrls: ['./customer-layout.component.scss']
})
export class CustomerLayoutComponent { }