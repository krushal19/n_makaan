import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.scss']
})
export class ManageUsers implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  users: UserProfile[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  async changeRole(user: UserProfile) {
    try {
      await this.adminService.updateUserRole(user.uid, user.role);
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    }
  }

  async deleteUser(user: UserProfile) {
    if (confirm(`Are you sure you want to delete user: ${user.email}?`)) {
      try {
        await this.adminService.deleteUser(user.uid);
        this.loadUsers(); // Reload data
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  }
}
