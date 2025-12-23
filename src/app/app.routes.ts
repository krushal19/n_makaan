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
import { SellerLayoutComponent } from './seller/components/seller-layout/seller-layout.component';
import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';
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

    // Customer Panel - WITH PROPER LAYOUT
    {
        path: 'customer',
        component: CustomerLayoutComponent,
        canActivate: [customerGuard],
        children: [
            { 
                path: '', 
                loadComponent: () => import('./customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) 
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) 
            },
            { 
                path: 'profile', 
                loadComponent: () => import('./customer/components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent) 
            }
        ]
    },

    // Seller Panel - WITH PROPER LAYOUT
    {
        path: 'seller',
        component: SellerLayoutComponent,
        canActivate: [sellerOnlyGuard],
        children: [
            { 
                path: '', 
                loadComponent: () => import('./seller/components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) 
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./seller/components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) 
            },
            { 
                path: 'add-property', 
                loadComponent: () => import('./seller/components/add-property/add-property.component').then(m => m.AddPropertyComponent) 
            },
            { 
                path: 'my-properties', 
                loadComponent: () => import('./seller/components/my-properties/my-properties.component').then(m => m.MyPropertiesComponent) 
            },
            { 
                path: 'my-customers', 
                loadComponent: () => import('./seller/components/my-customers/my-customers.component').then(m => m.MyCustomersComponent) 
            },
            { 
                path: 'profile', 
                loadComponent: () => import('./seller/components/seller-profile/seller-profile.component').then(m => m.SellerProfileComponent) 
            }
        ]
    },

    // Admin Panel - WITH PROPER LAYOUT AND SPECIAL LOGIN HANDLING
    {
        path: 'admin/login',
        loadComponent: () => import('./admin/components/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminOnlyGuard],
        children: [
            { 
                path: '', 
                loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
            },
            { 
                path: 'customer-management', 
                loadComponent: () => import('./admin/components/customer-management/customer-management.component').then(m => m.CustomerManagementComponent) 
            },
            { 
                path: 'seller-management', 
                loadComponent: () => import('./admin/components/seller-management/seller-management.component').then(m => m.SellerManagementComponent) 
            },
            { 
                path: 'verification-center', 
                loadComponent: () => import('./admin/components/verification-center/verification-center.component').then(m => m.VerificationCenterComponent) 
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
