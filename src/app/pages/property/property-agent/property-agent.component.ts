import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../components/shared/header/header';
import { FooterComponent } from '../../../components/shared/footer/footer';

@Component({
    selector: 'app-property-agent',
    standalone: true,
    imports: [RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './property-agent.html',
    styleUrls: ['./property-agent.scss']
})
export class PropertyAgentComponent {

}
