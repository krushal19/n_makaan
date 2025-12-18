import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-info-container">
      <div class="admin-info-card">
        <div class="admin-header">
          <div class="admin-icon">🔐</div>
          <h1>Admin Panel Access</h1>
        </div>
        
        <div class="credentials-section">
          <h2>Fixed Admin Credentials</h2>
          <div class="credential-item">
            <label>Email:</label>
            <div class="credential-value">admin@makaan.com</div>
          </div>
          <div class="credential-item">
            <label>Password:</label>
            <div class="credential-value">admin123</div>
          </div>
          <div class="credential-item">
            <label>Role:</label>
            <div class="credential-value role-admin">Admin</div>
          </div>
        </div>

        <div class="access-steps">
          <h3>How to Access Admin Panel:</h3>
          <ol>
            <li>Go to <a routerLink="/login" class="link">Login Page</a></li>
            <li>Enter the credentials above</li>
            <li>You'll be redirected to <a routerLink="/admin" class="link">Admin Dashboard</a></li>
          </ol>
        </div>

        <div class="features-list">
          <h3>Admin Panel Features:</h3>
          <ul>
            <li>📊 Dashboard with user statistics</li>
            <li>👥 Complete user management</li>
            <li>🗄️ Database overview</li>
            <li>🔍 Search and filter users</li>
            <li>⚙️ Role management system</li>
            <li>🗑️ Delete user accounts</li>
          </ul>
        </div>

        <div class="action-buttons">
          <a routerLink="/login" class="btn btn-primary">Login as Admin</a>
          <a routerLink="/admin" class="btn btn-secondary">Go to Admin Panel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-info-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .admin-info-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .admin-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .admin-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .admin-header h1 {
      margin: 0;
      color: #333;
      font-size: 2rem;
      font-weight: 700;
    }

    .credentials-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 15px;
      margin-bottom: 2rem;
    }

    .credentials-section h2 {
      margin-top: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .credential-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .credential-item label {
      font-weight: 600;
      color: #666;
    }

    .credential-value {
      font-family: 'Courier New', monospace;
      background: #e9ecef;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      font-weight: 600;
    }

    .role-admin {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .access-steps, .features-list {
      margin-bottom: 2rem;
    }

    .access-steps h3, .features-list h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .access-steps ol {
      padding-left: 1.5rem;
    }

    .access-steps li, .features-list li {
      margin-bottom: 0.5rem;
      color: #555;
    }

    .features-list ul {
      list-style: none;
      padding: 0;
    }

    .features-list li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .link:hover {
      text-decoration: underline;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .admin-info-card {
        padding: 2rem;
        margin: 1rem;
      }

      .credential-item {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class AdminInfoComponent {}