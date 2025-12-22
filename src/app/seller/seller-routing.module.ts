import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sellerGuard } from './guards/seller.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [sellerGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent)
      },
      {
        path: 'add-property',
        loadComponent: () => import('./components/add-property/add-property.component').then(m => m.AddPropertyComponent)
      },
      {
        path: 'my-properties',
        loadComponent: () => import('./components/my-properties/my-properties.component').then(m => m.MyPropertiesComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
