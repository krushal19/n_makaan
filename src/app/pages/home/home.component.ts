import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../core/models/user.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  
  properties: any[] = [];
  testimonials: any[] = [];
  isLoggedIn = false;
  userProfile: UserProfile | null = null;

  ngOnInit() {
    this.apiService.get<any>('properties').subscribe(data => {
      this.properties = data || [];
    });
    this.apiService.get<any>('testimonials').subscribe(data => {
      this.testimonials = data || [];
    });

    // Check if user is logged in and get profile
    this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          this.isLoggedIn = true;
          return this.authService.getUserProfile(user.uid);
        } else {
          this.isLoggedIn = false;
          return of(null);
        }
      })
    ).subscribe(profile => {
      this.userProfile = profile;
    });
  }
}
