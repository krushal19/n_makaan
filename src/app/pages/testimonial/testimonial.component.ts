import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-testimonial',
    standalone: true,
    imports: [CommonModule, RouterLink],
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
