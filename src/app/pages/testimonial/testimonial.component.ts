import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../../components/shared/header/header';
import { FooterComponent } from '../../components/shared/footer/footer';

@Component({
    selector: 'app-testimonial',
    standalone: true,
    imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './testimonial.html',
    styleUrls: ['./testimonial.scss']
})
export class TestimonialComponent implements OnInit {
    private apiService = inject(ApiService);
    testimonials: any[] = [];

    ngOnInit() {
        this.apiService.get<any>('testimonials').subscribe(data => {
            this.testimonials = data || [];
        });
    }
}
