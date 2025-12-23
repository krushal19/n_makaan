import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../core/models/user.model';
import { of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

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

      // Use Observable-based getUserProfile - NO Promise conversion!
      return authService.getUserProfile(user.uid).pipe(
        map((profile: UserProfile | null) => {
          if (profile && profile.role === 'seller') {
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
