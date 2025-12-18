import { Routes } from '@angular/router';
import { SellerDashboardComponent } from './dashboard/dashboard.component';

export const sellerRoutes: Routes = [
    { path: '', component: SellerDashboardComponent },
    { path: 'properties', loadComponent: () => import('./property-list/property-list.component').then(m => m.SellerPropertyListComponent) },
    { path: 'properties/add', loadComponent: () => import('./add-property/add-property.component').then(m => m.SellerAddPropertyComponent) },
    // { path: 'properties/edit/:id', loadComponent: () => import('./edit-property/edit-property.component').then(m => m.SellerEditPropertyComponent) },
];
