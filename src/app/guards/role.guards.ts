import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, map, take } from 'rxjs/operators';
import { from, of } from 'rxjs';

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
                        router.navigate(['/login']);
                        return false;
                    }
                })
            );
        })
    );
};

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
                        router.navigate(['/login']);
                        return false;
                    }
                })
            );
        })
    );
};

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
                        router.navigate(['/login']);
                        return false;
                    }
                })
            );
        })
    );
};

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
                        router.navigate(['/']);
                        return false;
                    }
                })
            );
        })
    );
};
