import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    switchMap(async (user) => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      try {
        // Check for hardcoded admin email
        if (user.email === 'admin@makaan.com') {
          return true;
        }
        
        const userProfile = await authService.getUserProfile(user.uid);
        if (userProfile && userProfile.role === 'admin') {
          return true;
        } else {
          router.navigate(['/']);
          return false;
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.navigate(['/login']);
        return false;
      }
    })
  );
};