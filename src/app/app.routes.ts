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
    // Public routes with customer layout (home for customers)
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
                    { path: ':id', component: PropertyListComponent }, // Property details
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

            // Customer-specific routes (when logged in as customer)
            { 
                path: 'dashboard', 
                loadComponent: () => import('./customer/components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
                canActivate: [customerGuard]
            },
            { 
                path: 'profile', 
                loadComponent: () => import('./customer/components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent),
                canActivate: [customerGuard]
            },
            { 
                path: 'wishlist', 
                loadComponent: () => import('./customer/components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent),
                canActivate: [customerGuard]
            },

            // Catch all for customer layout
            { path: '404', component: HomeComponent },
        ]
    },

    // Seller Panel - Separate routing structure
    {
        path: 'seller',
        component: SellerLayoutComponent,
        canActivate: [sellerOnlyGuard],
        children: [
            { 
                path: '', 
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./seller/components/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) 
            },
            { 
                path: 'properties', 
                loadComponent: () => import('./seller/components/my-properties/my-properties.component').then(m => m.MyPropertiesComponent) 
            },
            { 
                path: 'add-property', 
                loadComponent: () => import('./seller/components/add-property/add-property.component').then(m => m.AddPropertyComponent) 
            },
            { 
                path: 'edit-property/:id', 
                loadComponent: () => import('./seller/components/add-property/add-property.component').then(m => m.AddPropertyComponent) 
            },
            { 
                path: 'profile', 
                loadComponent: () => import('./seller/components/seller-profile/seller-profile.component').then(m => m.SellerProfileComponent) 
            }
        ]
    },

    // Admin Panel - Special login handling
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
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
            },
            { 
                path: 'customers', 
                loadComponent: () => import('./admin/components/customer-management/customer-management.component').then(m => m.CustomerManagementComponent) 
            },
            { 
                path: 'sellers', 
                loadComponent: () => import('./admin/components/seller-management/seller-management.component').then(m => m.SellerManagementComponent) 
            },
            { 
                path: 'reports', 
                loadComponent: () => import('./admin/components/verification-center/verification-center.component').then(m => m.VerificationCenterComponent) 
            },
            { 
                path: 'blocked-users', 
                loadComponent: () => import('./admin/components/customer-management/customer-management.component').then(m => m.CustomerManagementComponent) 
            },
            { 
                path: 'profile', 
                loadComponent: () => import('./admin/components/admin-profile/admin-profile.component').then(m => m.AdminProfileComponent) 
            },
            { 
                path: 'user-management', 
                loadComponent: () => import('./admin/components/user-management/user-management.component').then(m => m.UserManagementComponent) 
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
