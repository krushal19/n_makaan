import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PropertyListComponent } from './pages/property/property-list/property-list.component';
import { PropertyTypeComponent } from './pages/property/property-type/property-type.component';
import { PropertyAgentComponent } from './pages/property/property-agent/property-agent.component';
import { TestimonialComponent } from './pages/testimonial/testimonial.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomerLayoutComponent } from './components/shared/customer-layout/customer-layout.component';
import { authGuard, redirectIfAuthenticatedGuard } from './guards/auth.guard';
import { adminOnlyGuard, sellerOnlyGuard, customerGuard, homeGuard, blockAdminUrlGuard } from './guards/role.guards';

export const routes: Routes = [
    // Public routes with customer layout
    {
        path: '',
        component: CustomerLayoutComponent,
        children: [
            { path: '', component: HomeComponent, canActivate: [homeGuard] },
            { path: 'home', component: HomeComponent, canActivate: [homeGuard] },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactComponent },
            {
                path: 'property',
                children: [
                    { path: '', component: PropertyListComponent },
                    { path: 'list', component: PropertyListComponent },
                    { path: 'type', component: PropertyTypeComponent },
                    { path: 'agent', component: PropertyAgentComponent },
                ]
            },
            { path: 'testimonial', component: TestimonialComponent },

            // Auth Pages
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [redirectIfAuthenticatedGuard]
            },
            {
                path: 'register',
                component: RegisterComponent,
                canActivate: [redirectIfAuthenticatedGuard]
            },

            // Protected Dashboard (legacy)
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [authGuard]
            },

            // Protected Profile (legacy)
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard]
            },

            // Catch all for customer layout
            { path: '404', component: HomeComponent },
        ]
    },

    // Customer Panel - Simple routing without modules for now
    {
        path: 'customer',
        canActivate: [customerGuard],
        children: [
            { 
                path: '', 
                loadComponent: () => import('./customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) 
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) 
            }
        ]
    },

    // Seller Panel - Simple routing without modules for now  
    {
        path: 'seller',
        canActivate: [sellerOnlyGuard],
        children: [
            { 
                path: '', 
                loadComponent: () => import('./seller/components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) 
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./seller/components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) 
            }
        ]
    },

    // Admin Panel - Simple routing without modules for now
    {
        path: 'admin',
        canActivate: [adminOnlyGuard],
        children: [
            { 
                path: 'login', 
                loadComponent: () => import('./admin/components/admin-login/admin-login.component').then(m => m.AdminLoginComponent) 
            },
            { 
                path: '', 
                loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
            }
        ]
    },

    // Block any other admin URL attempts
    {
        path: '**',
        canActivate: [blockAdminUrlGuard],
        redirectTo: ''
    }
];
