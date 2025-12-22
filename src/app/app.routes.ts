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
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminInfoComponent } from './components/admin-info/admin-info.component';
import { CreateAdminComponent } from './utils/create-admin.component';
import { AdminLayoutComponent } from './components/shared/admin-layout/admin-layout.component';
import { CustomerDashboardPage } from './pages/customer-dashboard/customer-dashboard.page';
import { SellerDashboardPage } from './pages/seller-dashboard/seller-dashboard.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { PropertiesPage } from './pages/properties/properties.page';
import { CustomerLayoutComponent } from './components/shared/customer-layout/customer-layout.component';
import { authGuard, redirectIfAuthenticatedGuard } from './guards/auth.guard';
import { adminGuard, sellerGuard, customerGuard, homeGuard, sellerOnlyGuard } from './guards/role.guards';

export const routes: Routes = [
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

            // Protected Dashboard
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [authGuard]
            },

            // Protected Profile
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard]
            },



            // Legacy Dashboards (if needed)
            {
                path: 'customer-dashboard',
                component: CustomerDashboardPage,
                canActivate: [customerGuard]
            },
            {
                path: 'seller-dashboard',
                component: SellerDashboardPage,
                canActivate: [sellerGuard]
            },
            {
                path: 'admin-dashboard',
                component: AdminDashboardPage,
                canActivate: [authGuard]
            },

            // Demo Property CRUD
            { path: 'demo-properties', component: PropertiesPage },

            // Admin Info & Creation Utility
            { path: 'admin-info', component: AdminInfoComponent },
            { path: 'create-admin', component: CreateAdminComponent },

            // Catch all
            { path: '404', component: HomeComponent },
        ]
    },

    // Seller Module (separate layout) - Strict seller-only access
    {
        path: 'seller',
        loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule),
        canActivate: [sellerOnlyGuard]
    },

    // Admin Module (separate layout) - Strict admin-only access
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'dashboard', component: AdminDashboardComponent },
            // Add more admin routes here as needed
        ]
    },

    // Global catch all
    { path: '**', redirectTo: '' }
];
