import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

export interface Property {
  propertyId?: string;
  title: string;
  type: string;
  price: number;
  location: string;
  description: string;
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  constructor(private authService: AuthService, private firestore: Firestore) {}

  // Add new property
  addProperty(propertyData: Omit<Property, 'propertyId' | 'sellerId' | 'sellerName' | 'createdAt'>): Observable<string> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    return from(this.authService.getUserProfile(user.uid)).pipe(
      map(userProfile => {
        if (!userProfile) {
          throw new Error('User profile not found');
        }

        const property: Omit<Property, 'propertyId'> = {
          ...propertyData,
          sellerId: user.uid,
          sellerName: userProfile.displayName || userProfile.email || 'Unknown Seller',
          createdAt: serverTimestamp() as any
        };

        return addDoc(collection(this.firestore, 'properties'), property);
      }),
      map((docRef: any) => docRef.id)
    );
  }

  // Get seller's properties
  getSellerProperties(): Observable<Property[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(this.firestore, 'properties'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          propertyId: doc.id,
          ...doc.data()
        } as Property));
      })
    );
  }

  // Update property
  updateProperty(propertyId: string, updates: Partial<Property>): Observable<void> {
    const propertyRef = doc(this.firestore, 'properties', propertyId);
    return from(updateDoc(propertyRef, updates));
  }

  // Delete property
  deleteProperty(propertyId: string): Observable<void> {
    const propertyRef = doc(this.firestore, 'properties', propertyId);
    return from(deleteDoc(propertyRef));
  }
}
