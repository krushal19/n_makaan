import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminFooterComponent } from '../admin-footer/admin-footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminNavbarComponent, AdminFooterComponent],
  template: `
    <app-admin-header></app-admin-header>
    <app-admin-navbar></app-admin-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-admin-footer></app-admin-footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px); /* Adjust based on header/navbar/footer height */
      padding: 20px;
    }
  `]
})
export class AdminLayoutComponent {

}
