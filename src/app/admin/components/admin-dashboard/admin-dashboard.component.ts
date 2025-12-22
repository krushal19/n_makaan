import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminStats, DatabaseCollection } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  adminStats: AdminStats | null = null;
  allUsers: UserProfile[] = [];
  filteredUsers: UserProfile[] = [];
  databaseCollections: DatabaseCollection[] = [];

  searchTerm = '';
  selectedRole: 'all' | 'customer' | 'seller' | 'admin' = 'all';
  isLoading = true;
  currentAdmin: UserProfile | null = null;

  // Sidebar state
  sidebarCollapsed = false;
  activeMenuItem = 'dashboard';

  ngOnInit() {
    this.loadAdminData();
    this.loadCurrentAdmin();
  }

  async loadCurrentAdmin() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        // Check for hardcoded admin
        if (user.email === 'admin@makaan.com') {
          this.currentAdmin = {
            uid: user.uid,
            email: 'admin@makaan.com',
            displayName: 'System Admin',
            role: 'admin',
            createdAt: new Date()
          };
        } else {
          this.currentAdmin = await this.authService.getUserProfile(user.uid);
        }
      }
    } catch (error) {
      console.error('Error loading admin profile:', error);
    }
  }

  loadAdminData() {
    this.isLoading = true;

    // Load admin statistics
    this.adminService.getAdminStats().subscribe({
      next: (stats) => {
        this.adminStats = stats;
      },
      error: (error) => {
        console.error('Error loading admin stats:', error);
      }
    });

    // Load all users
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });

    // Load database collections
    this.adminService.getDatabaseCollections().subscribe({
      next: (collections) => {
        this.databaseCollections = collections;
      },
      error: (error) => {
        console.error('Error loading database collections:', error);
      }
    });
  }

  // Filter users based on search and role
  filterUsers() {
    let filtered = this.allUsers;

    // Filter by role
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  // Delete user
  async deleteUser(uid: string, email: string) {
    if (confirm(`Are you sure you want to delete user: ${email}?`)) {
      try {
        await this.adminService.deleteUser(uid);
        this.loadAdminData(); // Reload data
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  }

  // Update user role
  async updateUserRole(uid: string, newRole: 'customer' | 'seller' | 'admin') {
    try {
      await this.adminService.updateUserRole(uid, newRole);
      this.loadAdminData(); // Reload data
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    }
  }

  // Sidebar methods
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveMenuItem(item: string) {
    this.activeMenuItem = item;
  }

  // Logout
  async logout() {
    try {
      await this.authService.logout();
      // Navigate to admin login page
      // Assuming admin login is at /admin-login or similar
      // For now, navigate to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Utility methods
  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'seller': return '#fd7e14';
      case 'customer': return '#198754';
      default: return '#6c757d';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
