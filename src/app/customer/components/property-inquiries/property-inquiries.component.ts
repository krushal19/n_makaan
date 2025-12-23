import { Component } from '@angular/core';

@Component({
  selector: 'app-property-inquiries',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">My Property Inquiries</h6>
            <div class="bg-white rounded p-4 shadow-sm">
              <p>Your property inquiries will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./property-inquiries.component.scss']
})
export class PropertyInquiriesComponent { }