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
    switchMap((user) => {
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }

      // Check for hardcoded admin email
      if (user.email === 'admin@makaan.com') {
        return of(true);
      }
      
      // Use Observable-based getUserProfile - NO Promise conversion!
      return authService.getUserProfile(user.uid).pipe(
        map(userProfile => {
          if (userProfile && userProfile.role === 'admin') {
            return true;
          } else {
            router.navigate(['/']);
            return false;
          }
        })
      );
    })
  );
};