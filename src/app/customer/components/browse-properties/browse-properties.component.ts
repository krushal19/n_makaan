import { Component } from '@angular/core';

@Component({
  selector: 'app-browse-properties',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="bg-light rounded h-100 p-4">
            <h6 class="mb-4">Browse Properties</h6>
            <div class="bg-white rounded p-4 shadow-sm">
              <p>Property listings will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./browse-properties.component.scss']
})
export class BrowsePropertiesComponent { }