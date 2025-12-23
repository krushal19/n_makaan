import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, map, take } from 'rxjs/operators';
import { of } from 'rxjs';

// Strict Customer Guard - Only customers can access customer-specific routes
export const customerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('🔍 CUSTOMER GUARD - Testing URL:', state.url);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                console.log('❌ CUSTOMER GUARD - No user logged in, redirecting to login');
                router.navigate(['/login']);
                return of(false);
            }
            console.log('👤 CUSTOMER GUARD - User found:', user.email);
            return authService.getUserProfile(user.uid).pipe(
                map(profile => {
                    console.log('📋 CUSTOMER GUARD - User Profile:', profile);
                    console.log('🎯 CUSTOMER GUARD - Expected Role: customer');
                    console.log('🎯 CUSTOMER GUARD - User Role:', profile?.role);
                    
                    if (profile && profile.role === 'customer') {
                        console.log('✅ CUSTOMER GUARD - Access ALLOWED');
                        return true;
                    } else {
                        console.log('❌ CUSTOMER GUARD - Access BLOCKED');
                        // Redirect based on actual role
                        if (profile?.role === 'seller') {
                            console.log('🔄 CUSTOMER GUARD - Redirecting seller to /seller');
                            router.navigate(['/seller']);
                        } else if (profile?.role === 'admin') {
                            console.log('🔄 CUSTOMER GUARD - Redirecting admin to /admin/dashboard');
                            router.navigate(['/admin/dashboard']);
                        } else {
                            console.log('🔄 CUSTOMER GUARD - Redirecting to /login');
                            router.navigate(['/login']);
                        }
                        return false;
                    }
                })
            );
        })
    );
};

// Strict Seller Guard - Only sellers can access seller routes
export const sellerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('🔍 SELLER GUARD - Testing URL:', state.url);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                console.log('❌ SELLER GUARD - No user logged in, redirecting to login');
                router.navigate(['/login']);
                return of(false);
            }
            console.log('👤 SELLER GUARD - User found:', user.email);
            // Use Observable-based getUserProfile - NO Promise conversion!
            return authService.getUserProfile(user.uid).pipe(
                map(profile => {
                    console.log('📋 SELLER GUARD - User Profile:', profile);
                    console.log('🎯 SELLER GUARD - Expected Role: seller');
                    console.log('🎯 SELLER GUARD - User Role:', profile?.role);
                    
                    if (profile && profile.role === 'seller') {
                        console.log('✅ SELLER GUARD - Access ALLOWED');
                        return true;
                    } else {
                        console.log('❌ SELLER GUARD - Access BLOCKED');
                        // Redirect based on actual role
                        if (profile?.role === 'customer') {
                            console.log('🔄 SELLER GUARD - Redirecting customer to /dashboard');
                            router.navigate(['/dashboard']);
                        } else if (profile?.role === 'admin') {
                            console.log('🔄 SELLER GUARD - Redirecting admin to /admin/dashboard');
                            router.navigate(['/admin/dashboard']);
                        } else {
                            console.log('🔄 SELLER GUARD - Redirecting to /login');
                            router.navigate(['/login']);
                        }
                        return false;
                    }
                })
            );
        })
    );
};

// Strict Admin Guard - Only admins can access admin routes
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                router.navigate(['/login']);
                return of(false);
            }
            // Allow hardcoded admin
            if (user.email === 'admin@makaan.com') {
                return of(true);
            }
            // Use Observable-based getUserProfile - NO Promise conversion!
            return authService.getUserProfile(user.uid).pipe(
                map(profile => {
                    if (profile && profile.role === 'admin') {
                        return true;
                    } else {
                        // Redirect based on actual role
                        if (profile?.role === 'customer') {
                            router.navigate(['/customer']);
                        } else if (profile?.role === 'seller') {
                            router.navigate(['/seller']);
                        } else {
                            router.navigate(['/login']);
                        }
                        return false;
                    }
                })
            );
        })
    );
};

// Block admin URL access except through proper admin login
export const blockAdminUrlGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    
    // Block any URL containing /admin unless it's the admin login
    if (state.url.includes('/admin') && state.url !== '/admin/login') {
        router.navigate(['/']);
        return false;
    }
    return true;
};

// Home guard - Allow customers and non-logged users, redirect sellers to their panel
export const homeGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                // Allow non-logged in users to access home
                console.log('🏠 HOME GUARD - Non-logged user, allowing access to home');
                return of(true);
            }
            // Allow hardcoded admin
            if (user.email === 'admin@makaan.com') {
                console.log('🏠 HOME GUARD - Admin user, allowing access to home');
                return of(true);
            }
            return authService.getUserProfile(user.uid).pipe(
                map(profile => {
                    if (profile && profile.role === 'seller') {
                        // Redirect seller to seller dashboard
                        console.log('🏠 HOME GUARD - Seller detected, redirecting to /seller');
                        router.navigate(['/seller']);
                        return false;
                    } else {
                        // Allow customers and admins to access home
                        console.log('🏠 HOME GUARD - Customer/Admin, allowing access to home');
                        return true;
                    }
                })
            );
        })
    );
};

// Strict seller-only guard for seller module
export const sellerOnlyGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('🔍 SELLER GUARD - Testing URL:', state.url);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                console.log('❌ SELLER GUARD - No user logged in, redirecting to login');
                router.navigate(['/login']);
                return of(false);
            }
            console.log('👤 SELLER GUARD - User found:', user.email);
            // Use Observable-based getUserProfile - NO Promise conversion!
            return authService.getUserProfile(user.uid).pipe(
                map(profile => {
                    console.log('📋 SELLER GUARD - User Profile:', profile);
                    console.log('🎯 SELLER GUARD - Expected Role: seller');
                    console.log('🎯 SELLER GUARD - User Role:', profile?.role);
                    
                    if (profile && profile.role === 'seller') {
                        console.log('✅ SELLER GUARD - Access ALLOWED');
                        return true;
                    } else {
                        console.log('❌ SELLER GUARD - Access BLOCKED');
                        // Block non-sellers from accessing any seller routes
                        if (profile?.role === 'customer') {
                            console.log('🔄 SELLER GUARD - Redirecting customer to /customer');
                            router.navigate(['/customer']);
                        } else if (profile?.role === 'admin') {
                            console.log('🔄 SELLER GUARD - Redirecting admin to /admin');
                            router.navigate(['/admin']);
                        } else {
                            console.log('🔄 SELLER GUARD - Redirecting to /');
                            router.navigate(['/']);
                        }
                        return false;
                    }
                })
            );
        })
    );
};

// Admin-only guard for admin module
export const adminOnlyGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                router.navigate(['/login']);
                return of(false);
            }
            // Allow hardcoded admin
            if (user.email === 'admin@makaan.com') {
                return of(true);
            }
            // Use Observable-based getUserProfile - NO Promise conversion!
            return authService.getUserProfile(user.uid).pipe(
                map(profile => {
                    if (profile && profile.role === 'admin') {
                        return true;
                    } else {
                        // Block non-admins from accessing any admin routes
                        if (profile?.role === 'customer') {
                            router.navigate(['/customer']);
                        } else if (profile?.role === 'seller') {
                            router.navigate(['/seller']);
                        } else {
                            router.navigate(['/']);
                        }
                        return false;
                    }
                })
            );
        })
    );
};
