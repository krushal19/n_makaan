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
import { CustomerDashboardPage } from './pages/customer-dashboard/customer-dashboard.page';
import { SellerDashboardPage } from './pages/seller-dashboard/seller-dashboard.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';
import { PropertiesPage } from './pages/properties/properties.page';
import { authGuard, redirectIfAuthenticatedGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
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

    // Admin Dashboard
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
    },

    // Legacy Dashboards (if needed)
    {
        path: 'customer-dashboard',
        component: CustomerDashboardPage,
        canActivate: [authGuard]
    },
    {
        path: 'seller-dashboard',
        component: SellerDashboardPage,
        canActivate: [authGuard]
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
    { path: '**', redirectTo: '' }
];
