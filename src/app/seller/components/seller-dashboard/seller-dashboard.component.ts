import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  template: '',
  styles: []
})
export class SellerDashboardComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    // Redirect sellers directly to add property page as their landing page
    this.router.navigate(['/seller/add-property']);
  }
}
