import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, map, take } from 'rxjs/operators';
import { from, of } from 'rxjs';

// Strict Customer Guard - Only customers can access customer routes
export const customerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                router.navigate(['/login']);
                return of(false);
            }
            return from(authService.getUserProfile(user.uid)).pipe(
                map(profile => {
                    if (profile && profile.role === 'customer') {
                        return true;
                    } else {
                        // Redirect based on actual role
                        if (profile?.role === 'seller') {
                            router.navigate(['/seller']);
                        } else if (profile?.role === 'admin') {
                            router.navigate(['/admin']);
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

// Strict Seller Guard - Only sellers can access seller routes
export const sellerGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                router.navigate(['/login']);
                return of(false);
            }
            return from(authService.getUserProfile(user.uid)).pipe(
                map(profile => {
                    if (profile && profile.role === 'seller') {
                        return true;
                    } else {
                        // Redirect based on actual role
                        if (profile?.role === 'customer') {
                            router.navigate(['/customer']);
                        } else if (profile?.role === 'admin') {
                            router.navigate(['/admin']);
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
            return from(authService.getUserProfile(user.uid)).pipe(
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

// Home guard - Allow customers and admins, redirect sellers
export const homeGuard: CanActivateFn = (route, state) => {
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
            return from(authService.getUserProfile(user.uid)).pipe(
                map(profile => {
                    if (profile && (profile.role === 'admin' || profile.role === 'customer')) {
                        return true;
                    } else if (profile && profile.role === 'seller') {
                        // Block seller from home page and redirect to seller dashboard
                        router.navigate(['/seller']);
                        return false;
                    } else {
                        router.navigate(['/login']);
                        return false;
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

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                router.navigate(['/login']);
                return of(false);
            }
            return from(authService.getUserProfile(user.uid)).pipe(
                map(profile => {
                    if (profile && profile.role === 'seller') {
                        return true;
                    } else {
                        // Block non-sellers from accessing any seller routes
                        if (profile?.role === 'customer') {
                            router.navigate(['/customer']);
                        } else if (profile?.role === 'admin') {
                            router.navigate(['/admin']);
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
            return from(authService.getUserProfile(user.uid)).pipe(
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
