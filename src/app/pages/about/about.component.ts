import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/shared/header/header';
import { FooterComponent } from '../../components/shared/footer/footer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {

}
