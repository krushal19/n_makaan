import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerLayoutComponent } from './components/seller-layout/seller-layout.component';
import { sellerGuard } from '../guards/role.guards';

const routes: Routes = [
  {
    path: 'seller',
    component: SellerLayoutComponent,
    canActivate: [sellerGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent)
      },
      {
        path: 'add-property',
        loadComponent: () => import('./components/add-property/add-property.component').then(m => m.AddPropertyComponent)
      },
      {
        path: 'my-properties',
        loadComponent: () => import('./components/my-properties/my-properties.component').then(m => m.MyPropertiesComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
