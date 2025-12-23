import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, Timestamp } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
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
      console.log('🔥 REGISTRATION - Step 1: Creating Firebase Auth user');
      console.log('🔥 REGISTRATION - Email:', email, 'Role:', role, 'Name:', displayName);
      
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      console.log('🔥 REGISTRATION - Step 1 SUCCESS: Firebase Auth user created with UID:', uid);
      
      // Step 2: IMMEDIATELY write Firestore document (THIS CREATES THE COLLECTION)
      console.log('🔥 REGISTRATION - Step 2: Writing to Firestore users collection');
      
      const userDoc = {
        uid: uid,
        name: displayName || '',
        email: email,
        role: role, // This is CRITICAL - role must be saved
        aadhaarNumber: aadhaarNumber || '',
        panNumber: '',
        drivingLicense: '',
        phoneNumber: '',
        isVerified: false,
        isBlocked: false,
        reportCount: 0,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      };

      console.log('🔥 REGISTRATION - Writing document to users/{uid}:', userDoc);
      
      // CRITICAL: This setDoc() call MUST succeed to create users collection
      await setDoc(doc(this.firestore, 'users', uid), userDoc);
      
      console.log('🔥 REGISTRATION - Step 2 SUCCESS: Firestore document written');
      console.log('🔥 REGISTRATION - COLLECTION CREATED: users collection should now be visible in Firebase Console');
      console.log('🔥 REGISTRATION - Document path: users/' + uid);

      return userCredential.user;
    } catch (error: any) {
      console.error('🔥 REGISTRATION ERROR - Failed at step:', error);
      console.error('🔥 REGISTRATION ERROR - Code:', error.code);
      console.error('🔥 REGISTRATION ERROR - Message:', error.message);
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
      
      // Update lastLogin timestamp
      await this.updateUserProfile(credential.user.uid, {
        lastLogin: Timestamp.now()
      });
      
      return credential.user;
    } catch (error) {
      throw error;
    }
  }

  private async createHardcodedAdmin(): Promise<any> {
    try {
      console.log('🔥 ADMIN CREATION - Creating hardcoded admin account');
      
      // Create the hardcoded admin account
      const credential = await createUserWithEmailAndPassword(this.auth, 'admin@makaan.com', 'admin123');
      console.log('🔥 ADMIN CREATION - Firebase Auth admin created with UID:', credential.user.uid);

      // MANDATORY: Store admin profile in Firestore (creates users collection if not exists)
      const adminDoc = {
        uid: credential.user.uid,
        name: 'System Administrator',
        email: 'admin@makaan.com',
        role: 'admin',
        aadhaarNumber: '',
        panNumber: '',
        drivingLicense: '',
        phoneNumber: '',
        isVerified: true,
        isBlocked: false,
        reportCount: 0,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      };

      console.log('🔥 ADMIN CREATION - Writing admin document to users collection:', adminDoc);
      await setDoc(doc(this.firestore, 'users', credential.user.uid), adminDoc);
      console.log('🔥 ADMIN CREATION - SUCCESS: Admin document written to users/{uid}');

      return credential;
    } catch (error) {
      console.error('🔥 ADMIN CREATION ERROR - Failed to create hardcoded admin:', error);
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
      tap((data: any) => console.log('🔍 FIRESTORE RAW DATA:', data)),
      map((data: any) => {
        if (data) {
          const profile = {
            uid: data['uid'] || uid,
            email: data['email'] || '',
            displayName: data['name'] || data['displayName'] || '', // Check both name and displayName
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
          console.log('🔍 MAPPED PROFILE DATA:', profile);
          return profile;
        }
        console.log('🔍 NO FIRESTORE DATA FOUND');
        return null;
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Get current user profile as Observable (MAIN METHOD)
  getCurrentUserProfile(): Observable<UserProfile | null> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          console.log('🔍 AUTH SERVICE - Getting profile for UID:', user.uid);
          return this.getUserProfile(user.uid);
        }
        console.log('🔍 AUTH SERVICE - No authenticated user');
        return of(null);
      })
    );
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

  // Admin method to create users without logging them in
  async createUserAsAdmin(email: string, password: string, displayName: string, role: 'customer' | 'seller', aadhaarNumber?: string, phoneNumber?: string): Promise<string> {
    try {
      console.log('🔥 ADMIN USER CREATION - Starting process');
      console.log('🔥 ADMIN USER CREATION - Email:', email, 'Role:', role, 'Name:', displayName);
      
      // Store current admin user info
      const currentUser = this.auth.currentUser;
      const currentUserEmail = currentUser?.email;
      
      console.log('🔥 ADMIN USER CREATION - Current admin:', currentUserEmail);
      
      // Step 1: Create Firebase Auth user
      console.log('🔥 ADMIN USER CREATION - Step 1: Creating Firebase Auth user');
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      
      console.log('🔥 ADMIN USER CREATION - Step 1 SUCCESS: Auth user created with UID:', uid);
      
      // Step 2: IMMEDIATELY write Firestore document
      console.log('🔥 ADMIN USER CREATION - Step 2: Writing to Firestore users collection');
      
      const userDoc = {
        uid: uid,
        name: displayName || '',
        email: email,
        role: role, // CRITICAL - role must be saved
        aadhaarNumber: aadhaarNumber || '',
        panNumber: '',
        drivingLicense: '',
        phoneNumber: phoneNumber || '',
        isVerified: false,
        isBlocked: false,
        reportCount: 0,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      };

      console.log('🔥 ADMIN USER CREATION - Writing document to users/{uid}:', userDoc);
      
      // CRITICAL: This setDoc() call MUST succeed
      await setDoc(doc(this.firestore, 'users', uid), userDoc);
      
      console.log('🔥 ADMIN USER CREATION - Step 2 SUCCESS: Firestore document written');
      console.log('🔥 ADMIN USER CREATION - Document path: users/' + uid);
      
      // Step 3: Sign out the new user immediately
      await signOut(this.auth);
      console.log('🔥 ADMIN USER CREATION - Step 3: New user signed out');
      
      // Step 4: Re-authenticate the admin
      if (currentUserEmail === 'admin@makaan.com') {
        console.log('🔥 ADMIN USER CREATION - Step 4: Re-authenticating admin');
        await signInWithEmailAndPassword(this.auth, 'admin@makaan.com', 'admin123');
        console.log('🔥 ADMIN USER CREATION - Step 4 SUCCESS: Admin re-authenticated');
      }
      
      console.log('🔥 ADMIN USER CREATION - COMPLETE: User created successfully');
      console.log('🔥 ADMIN USER CREATION - users collection should be visible in Firebase Console');
      
      return uid;
    } catch (error: any) {
      console.error('🔥 ADMIN USER CREATION ERROR - Process failed:', error);
      console.error('🔥 ADMIN USER CREATION ERROR - Code:', error.code);
      console.error('🔥 ADMIN USER CREATION ERROR - Message:', error.message);
      
      // Try to re-authenticate admin if something went wrong
      try {
        await signInWithEmailAndPassword(this.auth, 'admin@makaan.com', 'admin123');
        console.log('🔥 ADMIN USER CREATION - Admin re-authenticated after error');
      } catch (reAuthError) {
        console.error('🔥 ADMIN USER CREATION ERROR - Failed to re-authenticate admin:', reAuthError);
      }
      
      throw error;
    }
  }
}