import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../components/shared/header/header';
import { FooterComponent } from '../../../components/shared/footer/footer';

@Component({
    selector: 'app-property-type',
    standalone: true,
    imports: [RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './property-type.html',
    styleUrls: ['./property-type.scss']
})
export class PropertyTypeComponent {

}
