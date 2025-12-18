import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-seller-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container-fluid py-5">
      <div class="container">
        <h1>Seller Dashboard</h1>
        <div class="row">
            <div class="col-md-3">
                <div class="list-group">
                    <a routerLink="/seller" class="list-group-item list-group-item-action active">Dashboard</a>
                    <a routerLink="/seller/properties" class="list-group-item list-group-item-action">My Properties</a>
                    <a routerLink="/seller/properties/add" class="list-group-item list-group-item-action">Add Property</a>
                </div>
            </div>
            <div class="col-md-9">
                <div class="card">
                    <div class="card-body">
                        <h3>Welcome to Seller Panel</h3>
                        <p>Manage your properties here.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class SellerDashboardComponent { }
