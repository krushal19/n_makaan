import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container-fluid py-5">
      <div class="container">
        <h1>Admin Dashboard</h1>
        <div class="row">
            <div class="col-md-3">
                <div class="list-group">
                    <a routerLink="/admin" class="list-group-item list-group-item-action active">Dashboard</a>
                    <a routerLink="/admin/users" class="list-group-item list-group-item-action">Users</a>
                    <a routerLink="/admin/sellers" class="list-group-item list-group-item-action">Sellers</a>
                    <a routerLink="/admin/properties" class="list-group-item list-group-item-action">Properties</a>
                </div>
            </div>
            <div class="col-md-9">
                <div class="card">
                    <div class="card-body">
                        <h3>Welcome to Admin Panel</h3>
                        <p>Manage users and platform content here.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent { }
