import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Verification Center</h6>
            <div class="bg-white rounded p-4 shadow-sm">
              <p>Verification Center functionality will be implemented here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./verification-center.component.scss']
})
export class VerificationCenterComponent { }
