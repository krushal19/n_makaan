import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard.component';

export const adminRoutes: Routes = [
    { path: '', component: AdminDashboardComponent },
    { path: 'users', loadComponent: () => import('./user-list/user-list.component').then(m => m.AdminUserListComponent) },
    { path: 'sellers', loadComponent: () => import('./seller-list/seller-list.component').then(m => m.AdminSellerListComponent) },
    { path: 'properties', loadComponent: () => import('./property-list/property-list.component').then(m => m.AdminPropertyListComponent) },
];
