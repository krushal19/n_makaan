import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService, UserProfile } from '../../services/auth.service';
import { HeaderComponent } from '../../components/shared/header/header';
import { FooterComponent } from '../../components/shared/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
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

    // Check if user is logged in
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userProfile = await this.authService.getUserProfile(user.uid);
      } else {
        this.isLoggedIn = false;
        this.userProfile = null;
      }
    });
  }
}
