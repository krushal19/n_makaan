import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy, where, limit } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { UserProfile } from '../core/models/user.model';

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalSellers: number;
  totalAdmins: number;
  recentUsers: UserProfile[];
}

export interface DatabaseCollection {
  name: string;
  count: number;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private firestore = inject(Firestore);

  // Get all users from database
  getAllUsers(): Observable<UserProfile[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date()
        } as UserProfile))
      )
    );
  }

  // Get admin statistics
  getAdminStats(): Observable<AdminStats> {
    return this.getAllUsers().pipe(
      map(users => {
        const totalUsers = users.length;
        const totalCustomers = users.filter(u => u.role === 'customer').length;
        const totalSellers = users.filter(u => u.role === 'seller').length;
        const totalAdmins = users.filter(u => u.role === 'admin').length;
        const recentUsers = users.slice(0, 5);

        return {
          totalUsers,
          totalCustomers,
          totalSellers,
          totalAdmins,
          recentUsers
        };
      })
    );
  }

  // Delete user
  async deleteUser(uid: string): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Update user role
  async updateUserRole(uid: string, role: 'customer' | 'seller' | 'admin'): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      await updateDoc(userDoc, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Get database collections info
  getDatabaseCollections(): Observable<DatabaseCollection[]> {
    return from(this.getCollectionCounts()).pipe(
      map(counts => [
        {
          name: 'Users',
          count: counts['users'] || 0,
          icon: '👥'
        },
        {
          name: 'Properties',
          count: counts['properties'] || 0,
          icon: '🏠'
        },
        {
          name: 'Bookings',
          count: counts['bookings'] || 0,
          icon: '📅'
        },
        {
          name: 'Reviews',
          count: counts['reviews'] || 0,
          icon: '⭐'
        }
      ])
    );
  }

  private async getCollectionCounts(): Promise<{[key: string]: number}> {
    try {
      const collections = ['users', 'properties', 'bookings', 'reviews'];
      const counts: {[key: string]: number} = {};

      for (const collectionName of collections) {
        try {
          const collectionRef = collection(this.firestore, collectionName);
          const snapshot = await getDocs(collectionRef);
          counts[collectionName] = snapshot.size;
        } catch (error) {
          console.warn(`Error getting count for ${collectionName}:`, error);
          counts[collectionName] = 0;
        }
      }

      return counts;
    } catch (error) {
      console.error('Error getting collection counts:', error);
      return {};
    }
  }

  // Search users
  searchUsers(searchTerm: string): Observable<UserProfile[]> {
    return this.getAllUsers().pipe(
      map(users => 
        users.filter(user => 
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  // Get users by role
  getUsersByRole(role: 'customer' | 'seller' | 'admin'): Observable<UserProfile[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === role))
    );
  }
}