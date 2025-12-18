import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-admin-user-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-list.component.html',
})
export class AdminUserListComponent implements OnInit {
    private apiService = inject(ApiService);
    users: any[] = [];

    ngOnInit() {
        this.apiService.get<any[]>('users').subscribe(data => {
            this.users = data || [];
        });
    }

    deleteUser(uid: string) {
        if (confirm('Are you sure?')) {
            // In real app, this would delete user
            this.users = this.users.filter(u => u.uid !== uid);
        }
    }
}
