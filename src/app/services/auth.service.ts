import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserProfile } from '../core/models/user.model';

export type { UserProfile };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = user(this.auth);

  async register(email: string, password: string, displayName?: string, role: 'customer' | 'seller' | 'admin' = 'customer', aadhaarNumber?: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Store user profile in Firestore
      const userProfile: UserProfile = {
        uid: credential.user.uid,
        email: credential.user.email!,
        displayName: displayName || '',
        role: role,
        aadhaarNumber: aadhaarNumber || '',
        isVerified: false,
        isBlocked: false,
        reportCount: 0,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      await setDoc(doc(this.firestore, 'users', credential.user.uid), userProfile);

      return credential.user;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      // Check for hardcoded admin credentials
      if (email === 'admin@makaan.com' && password === 'admin123') {
        // Create a mock admin user for hardcoded credentials
        const credential = await signInWithEmailAndPassword(this.auth, email, password).catch(async () => {
          // If admin doesn't exist in Firebase, create it
          return await this.createHardcodedAdmin();
        });
        return credential.user;
      }

      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential.user;
    } catch (error) {
      throw error;
    }
  }

  private async createHardcodedAdmin(): Promise<any> {
    try {
      // Create the hardcoded admin account
      const credential = await createUserWithEmailAndPassword(this.auth, 'admin@makaan.com', 'admin123');

      // Store admin profile in Firestore
      const adminProfile: UserProfile = {
        uid: credential.user.uid,
        email: 'admin@makaan.com',
        displayName: 'System Admin',
        role: 'admin',
        createdAt: new Date()
      };

      await setDoc(doc(this.firestore, 'users', credential.user.uid), adminProfile);

      return credential;
    } catch (error) {
      console.error('Error creating hardcoded admin:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  // Observable-based method to get user profile - NO PROMISES!
  getUserProfile(uid: string): Observable<UserProfile | null> {
    const docRef = doc(this.firestore, 'users', uid);
    return docData(docRef, { idField: 'uid' }).pipe(
      map(data => {
        if (data) {
          return {
            uid: data['uid'] || uid,
            email: data['email'] || '',
            displayName: data['displayName'] || '',
            phoneNumber: data['phoneNumber'] || '',
            role: data['role'] || 'customer',
            aadhaarNumber: data['aadhaarNumber'] || '',
            panNumber: data['panNumber'] || '',
            drivingLicense: data['drivingLicense'] || '',
            isVerified: data['isVerified'] || false,
            isBlocked: data['isBlocked'] || false,
            reportCount: data['reportCount'] || 0,
            createdAt: data['createdAt'] || new Date(),
            lastLogin: data['lastLogin'] || new Date()
          } as UserProfile;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );
  }

  // Temporary Promise-based method for backward compatibility - WILL BE REMOVED
  async getUserProfilePromise(uid: string): Promise<UserProfile | null> {
    return new Promise((resolve, reject) => {
      this.getUserProfile(uid).subscribe({
        next: (profile) => resolve(profile),
        error: (error) => reject(error)
      });
    });
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'users', uid);
      await setDoc(docRef, updates, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}
