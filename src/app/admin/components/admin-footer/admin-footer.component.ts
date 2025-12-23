import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-12 text-center">
            <h5 class="text-white mb-4">Admin Control Panel</h5>
            <p class="mb-2">Secure administrative access for system management</p>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="copyright">
          <div class="row">
            <div class="col-md-12 text-center">
              &copy; <a class="border-bottom text-primary" href="#">Makaan</a> Admin Panel, All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-footer.component.scss']
})
export class AdminFooterComponent { }