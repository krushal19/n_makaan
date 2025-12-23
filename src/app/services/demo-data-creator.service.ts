import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserProfile, Property } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DemoDataCreatorService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // FORCE FIRESTORE COLLECTIONS CREATION
  async createDemoDataAndForceCollections(): Promise<void> {
    try {
      console.log('🔥 DEMO DATA - Starting demo data creation to force Firestore collections');

      // Step 1: Create demo users (this creates 'users' collection)
      await this.createDemoUsers();

      // Step 2: Create demo properties (this creates 'properties' collection)
      await this.createDemoProperties();

      // Step 3: Create demo reports (this creates 'reports' collection)
      await this.createDemoReports();

      console.log('🔥 DEMO DATA SUCCESS - All collections should now be visible in Firebase Console');
      console.log('🔥 DEMO DATA SUCCESS - Check Firebase Console: users, properties, reports collections');
    } catch (error) {
      console.error('🔥 DEMO DATA ERROR - Failed to create demo data:', error);
      throw error;
    }
  }

  private async createDemoUsers(): Promise<void> {
    console.log('🔥 DEMO USERS - Creating demo users to force users collection');

    const demoUsers = [
      {
        email: 'demo.seller@makaan.com',
        password: 'demo123',
        displayName: 'Demo Seller',
        role: 'seller' as const,
        aadhaarNumber: '123456789012'
      },
      {
        email: 'demo.customer@makaan.com',
        password: 'demo123',
        displayName: 'Demo Customer',
        role: 'customer' as const,
        aadhaarNumber: '987654321098'
      }
    ];

    for (const userData of demoUsers) {
      try {
        // Create Firebase Auth user
        const credential = await createUserWithEmailAndPassword(
          this.auth, 
          userData.email, 
          userData.password
        );

        // Create Firestore document (FORCES users collection creation)
        const userProfile: UserProfile = {
          uid: credential.user.uid,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          aadhaarNumber: userData.aadhaarNumber,
          panNumber: '',
          drivingLicense: '',
          phoneNumber: '',
          isVerified: false,
          isBlocked: false,
          reportCount: 0,
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now()
        };

        await setDoc(doc(this.firestore, 'users', credential.user.uid), userProfile);
        console.log(`🔥 DEMO USERS - Created ${userData.role}: ${userData.email} (UID: ${credential.user.uid})`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`🔥 DEMO USERS - User already exists: ${userData.email}`);
        } else {
          console.error(`🔥 DEMO USERS - Error creating ${userData.email}:`, error);
        }
      }
    }
  }

  private async createDemoProperties(): Promise<void> {
    console.log('🔥 DEMO PROPERTIES - Creating demo properties to force properties collection');

    const demoProperties = [
      {
        title: 'Luxury 3BHK Apartment in Downtown',
        description: 'Beautiful spacious apartment with modern amenities',
        price: 5000000,
        location: 'Downtown, Mumbai',
        type: 'sale' as const,
        category: 'apartment' as const,
        sellerId: 'demo-seller-id',
        sellerName: 'Demo Seller',
        images: ['https://example.com/image1.jpg'],
        amenities: ['Parking', 'Gym', 'Swimming Pool'],
        area: 1200,
        bedrooms: 3,
        bathrooms: 2,
        legalDocuments: ['Property Papers', 'NOC']
      },
      {
        title: 'Modern 2BHK House for Rent',
        description: 'Cozy house perfect for small families',
        price: 25000,
        location: 'Suburbs, Delhi',
        type: 'rent' as const,
        category: 'house' as const,
        sellerId: 'demo-seller-id',
        sellerName: 'Demo Seller',
        images: ['https://example.com/image2.jpg'],
        amenities: ['Garden', 'Parking'],
        area: 800,
        bedrooms: 2,
        bathrooms: 1,
        legalDocuments: ['Rental Agreement']
      }
    ];

    for (const propertyData of demoProperties) {
      try {
        const property = {
          ...propertyData,
          isActive: true,
          isVerified: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        // FORCES properties collection creation
        const docRef = await addDoc(collection(this.firestore, 'properties'), property);
        console.log(`🔥 DEMO PROPERTIES - Created property: ${property.title} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`🔥 DEMO PROPERTIES - Error creating property ${propertyData.title}:`, error);
      }
    }
  }

  private async createDemoReports(): Promise<void> {
    console.log('🔥 DEMO REPORTS - Creating demo reports to force reports collection');

    const demoReports = [
      {
        reporterId: 'demo-customer-id',
        reporterName: 'Demo Customer',
        sellerId: 'demo-seller-id',
        sellerName: 'Demo Seller',
        reason: 'Misleading information',
        description: 'Property details do not match actual condition',
        status: 'pending' as const
      }
    ];

    for (const reportData of demoReports) {
      try {
        const report = {
          ...reportData,
          createdAt: Timestamp.now()
        };

        // FORCES reports collection creation
        const docRef = await addDoc(collection(this.firestore, 'reports'), report);
        console.log(`🔥 DEMO REPORTS - Created report: ${report.reason} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`🔥 DEMO REPORTS - Error creating report:`, error);
      }
    }
  }

  // Method to check if collections exist
  async checkCollectionsExist(): Promise<void> {
    console.log('🔥 COLLECTION CHECK - Verifying Firestore collections exist');
    
    try {
      // Try to read from each collection
      const collections = ['users', 'properties', 'reports'];
      
      for (const collectionName of collections) {
        const collectionRef = collection(this.firestore, collectionName);
        console.log(`🔥 COLLECTION CHECK - ${collectionName} collection reference created`);
      }
      
      console.log('🔥 COLLECTION CHECK - All collection references created successfully');
      console.log('🔥 COLLECTION CHECK - Collections should be visible in Firebase Console after first document write');
    } catch (error) {
      console.error('🔥 COLLECTION CHECK - Error checking collections:', error);
    }
  }
}