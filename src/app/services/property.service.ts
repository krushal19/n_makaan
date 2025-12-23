import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Property } from '../core/models/user.model';

// Re-export Property interface for convenience
export type { Property } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private firestore = inject(Firestore);

  // Create a new property
  async createProperty(propertyData: Partial<Property>): Promise<string> {
    try {
      console.log('🔥 FIRESTORE WRITE - Creating property in properties collection:', propertyData);
      
      // MANDATORY: Ensure all required fields are present
      const property = {
        ...propertyData,
        isActive: true,
        isVerified: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      console.log('🔥 FIRESTORE WRITE - Writing property document to properties collection:', property);
      
      // CRITICAL: This addDoc() call creates the 'properties' collection in Firestore
      const docRef = await addDoc(collection(this.firestore, 'properties'), property);
      
      console.log('🔥 FIRESTORE SUCCESS - Property created with ID:', docRef.id);
      console.log('🔥 FIRESTORE SUCCESS - Collection "properties" should now be visible in Firebase Console');
      
      return docRef.id;
    } catch (error) {
      console.error('🔥 FIRESTORE ERROR - Property creation failed:', error);
      throw error;
    }
  }

  // Get all properties
  getAllProperties(): Observable<Property[]> {
    const propertiesRef = collection(this.firestore, 'properties');
    const q = query(propertiesRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Property[]>;
  }

  // Get properties by seller
  getPropertiesBySeller(sellerId: string): Observable<Property[]> {
    const propertiesRef = collection(this.firestore, 'properties');
    const q = query(propertiesRef, where('sellerId', '==', sellerId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Property[]>;
  }

  // Update property
  async updateProperty(propertyId: string, updates: Partial<Property>): Promise<void> {
    try {
      const propertyRef = doc(this.firestore, 'properties', propertyId);
      await updateDoc(propertyRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      console.log('🔍 PROPERTY SERVICE - Property updated:', propertyId);
    } catch (error) {
      console.error('🔍 PROPERTY SERVICE - Error updating property:', error);
      throw error;
    }
  }

  // Delete property
  async deleteProperty(propertyId: string): Promise<void> {
    try {
      const propertyRef = doc(this.firestore, 'properties', propertyId);
      await deleteDoc(propertyRef);
      console.log('🔍 PROPERTY SERVICE - Property deleted:', propertyId);
    } catch (error) {
      console.error('🔍 PROPERTY SERVICE - Error deleting property:', error);
      throw error;
    }
  }

  // Verify property
  async verifyProperty(propertyId: string, isVerified: boolean): Promise<void> {
    try {
      const propertyRef = doc(this.firestore, 'properties', propertyId);
      await updateDoc(propertyRef, {
        isVerified,
        verifiedAt: isVerified ? Timestamp.now() : null,
        updatedAt: Timestamp.now()
      });
      console.log('🔍 PROPERTY SERVICE - Property verification updated:', propertyId, isVerified);
    } catch (error) {
      console.error('🔍 PROPERTY SERVICE - Error updating property verification:', error);
      throw error;
    }
  }
}