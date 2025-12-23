import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  private firestore = inject(Firestore);

  async createDemoProperty(sellerId: string, sellerName: string) {
    const demoProperty = {
      title: 'Luxury 3BHK Apartment in Downtown',
      description: 'Beautiful spacious apartment with modern amenities, perfect for families. Located in the heart of the city with easy access to schools, hospitals, and shopping centers.',
      price: 5000000,
      location: 'Downtown, Mumbai',
      type: 'sale',
      category: 'apartment',
      sellerId: sellerId,
      sellerName: sellerName,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
      ],
      amenities: ['Parking', 'Gym', 'Swimming Pool', '24/7 Security', 'Power Backup'],
      area: 1200,
      bedrooms: 3,
      bathrooms: 2,
      isActive: true,
      isVerified: true,
      legalDocuments: ['Property Papers', 'NOC', 'Approval Letter'],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    try {
      const docRef = await addDoc(collection(this.firestore, 'properties'), demoProperty);
      console.log('✅ Demo property created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating demo property:', error);
      throw error;
    }
  }

  async createDemoReport(sellerId: string, customerId: string) {
    const demoReport = {
      reporterId: customerId,
      reporterName: 'Demo Customer',
      sellerId: sellerId,
      sellerName: 'Demo Seller',
      reason: 'Misleading property information',
      description: 'The property details provided do not match the actual property condition.',
      status: 'pending',
      createdAt: Timestamp.now()
    };

    try {
      const docRef = await addDoc(collection(this.firestore, 'reports'), demoReport);
      console.log('✅ Demo report created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating demo report:', error);
      throw error;
    }
  }
}