import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">My Customers</h6>
            <div class="bg-white rounded p-4 shadow-sm">
              <p>My Customers functionality will be implemented here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./my-customers.component.scss']
})
export class MyCustomersComponent { }
