import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="container-fluid bg-primary px-5 d-none d-lg-block">
      <div class="row gx-0">
        <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
          <div class="d-inline-flex align-items-center" style="height: 45px;">
            <small class="me-3 text-light">
              <i class="fa fa-shield-alt me-2"></i>Admin Control Panel - System Management
            </small>
          </div>
        </div>
        <div class="col-lg-4 text-center text-lg-end">
          <div class="d-inline-flex align-items-center" style="height: 45px;">
            <small class="text-light">
              <i class="fa fa-clock me-2"></i>{{currentTime | date:'short'}}
            </small>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  currentTime = new Date();
  
  constructor() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}