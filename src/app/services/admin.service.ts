import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile, Property, Report } from '../core/models/user.model';

export interface AdminStats {
  totalCustomers: number;
  totalSellers: number;
  totalProperties: number;
  pendingReports: number;
  activeCustomers: number;
  blockedCustomers: number;
  activeSellers: number;
  blockedSellers: number;
  newReports: number;
  resolvedReports: number;
}

export interface SystemActivity {
  id: string;
  activity: string;
  user: string;
  userType: string;
  date: string;
  status: string;
  timestamp: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private firestore = inject(Firestore);

  // Get all users with real-time updates
  getAllUsers(): Observable<UserProfile[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' }) as Observable<UserProfile[]>;
  }

  // Get users by role
  getUsersByRole(role: 'customer' | 'seller' | 'admin'): Observable<UserProfile[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('role', '==', role));
    return collectionData(q, { idField: 'uid' }) as Observable<UserProfile[]>;
  }

  // Get all properties with real-time updates
  getAllProperties(): Observable<Property[]> {
    const propertiesRef = collection(this.firestore, 'properties');
    return collectionData(propertiesRef, { idField: 'id' }) as Observable<Property[]>;
  }

  // Get all reports with real-time updates
  getAllReports(): Observable<Report[]> {
    const reportsRef = collection(this.firestore, 'reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Report[]>;
  }

  // Get dynamic admin statistics
  getAdminStats(): Observable<AdminStats> {
    return combineLatest([
      this.getAllUsers(),
      this.getAllProperties(),
      this.getAllReports()
    ]).pipe(
      map(([users, properties, reports]) => {
        const customers = users.filter(u => u.role === 'customer');
        const sellers = users.filter(u => u.role === 'seller');
        
        return {
          totalCustomers: customers.length,
          totalSellers: sellers.length,
          totalProperties: properties.length,
          pendingReports: reports.filter(r => r.status === 'pending').length,
          activeCustomers: customers.filter(c => !c.isBlocked).length,
          blockedCustomers: customers.filter(c => c.isBlocked).length,
          activeSellers: sellers.filter(s => !s.isBlocked).length,
          blockedSellers: sellers.filter(s => s.isBlocked).length,
          newReports: reports.filter(r => r.status === 'pending').length,
          resolvedReports: reports.filter(r => r.status === 'resolved').length
        };
      })
    );
  }

  // Get recent system activities
  getRecentActivities(): Observable<SystemActivity[]> {
    return combineLatest([
      this.getAllUsers(),
      this.getAllProperties(),
      this.getAllReports()
    ]).pipe(
      map(([users, properties, reports]) => {
        const activities: SystemActivity[] = [];

        // Add recent user registrations
        users
          .filter(u => u.createdAt)
          .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
          .slice(0, 3)
          .forEach(user => {
            activities.push({
              id: `user-${user.uid}`,
              activity: 'New User Registration',
              user: user.displayName || user.email,
              userType: user.role,
              date: new Date(user.createdAt.seconds * 1000).toLocaleDateString(),
              status: user.isVerified ? 'Verified' : 'Pending Verification',
              timestamp: user.createdAt
            });
          });

        // Add recent property listings
        properties
          .filter(p => p.createdAt)
          .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
          .slice(0, 2)
          .forEach(property => {
            activities.push({
              id: `property-${property.id}`,
              activity: 'New Property Listed',
              user: property.sellerName || 'Unknown Seller',
              userType: 'seller',
              date: new Date(property.createdAt.seconds * 1000).toLocaleDateString(),
              status: property.isVerified ? 'Approved' : 'Under Review',
              timestamp: property.createdAt
            });
          });

        // Add recent reports
        reports
          .slice(0, 2)
          .forEach(report => {
            activities.push({
              id: `report-${report.id}`,
              activity: 'Report Filed',
              user: report.reporterName || 'Anonymous',
              userType: 'customer',
              date: new Date(report.createdAt.seconds * 1000).toLocaleDateString(),
              status: report.status,
              timestamp: report.createdAt
            });
          });

        // Sort by timestamp and return latest 10
        return activities
          .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
          .slice(0, 10);
      })
    );
  }

  // Block/Unblock user
  async toggleUserBlock(uid: string, isBlocked: boolean): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { isBlocked });
  }

  // Update user password (admin function)
  async updateUserPassword(uid: string, newPassword: string): Promise<void> {
    // Note: This would typically require Firebase Admin SDK
    // For now, we'll just update a flag in Firestore
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { 
      passwordResetRequired: true,
      passwordResetTimestamp: Timestamp.now()
    });
  }

  // Delete property
  async deleteProperty(propertyId: string): Promise<void> {
    const propertyRef = doc(this.firestore, 'properties', propertyId);
    await deleteDoc(propertyRef);
  }

  // Update report status
  async updateReportStatus(reportId: string, status: 'pending' | 'reviewed' | 'resolved'): Promise<void> {
    const reportRef = doc(this.firestore, 'reports', reportId);
    await updateDoc(reportRef, { status });
  }

  // Auto-handle reports (5 reports = warning, 8 reports = block)
  async handleUserReports(uid: string, reportCount: number): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    
    if (reportCount >= 8) {
      // Auto-block user
      await updateDoc(userRef, { 
        isBlocked: true,
        blockReason: 'Automatic block due to 8+ reports',
        blockedAt: Timestamp.now()
      });
    } else if (reportCount >= 5) {
      // Send warning
      await updateDoc(userRef, { 
        warningIssued: true,
        warningIssuedAt: Timestamp.now(),
        warningReason: 'Warning due to 5+ reports'
      });
    }
  }

  // Update user role
  async updateUserRole(uid: string, newRole: 'customer' | 'seller' | 'admin'): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { role: newRole });
  }

  // Delete user (soft delete by blocking)
  async deleteUser(uid: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { 
      isBlocked: true,
      deletedAt: Timestamp.now(),
      isDeleted: true
    });
  }

  // Verify user documents
  async verifyUser(uid: string, isVerified: boolean): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { 
      isVerified,
      verifiedAt: isVerified ? Timestamp.now() : null
    });
  }
}