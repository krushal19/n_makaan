import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Property {
    id?: string;
    title: string;
    price: number;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class PropertyService {
    private firestore: Firestore = inject(Firestore); // Inject Firestore

    constructor() { }

    // Get all properties
    getProperties(): Observable<Property[]> {
        const propertiesCollection = collection(this.firestore, 'properties');
        return collectionData(propertiesCollection, { idField: 'id' }) as Observable<Property[]>;
    }

    // Get single property by ID
    getPropertyById(id: string): Observable<Property> {
        const propertyDocRef = doc(this.firestore, `properties/${id}`);
        return docData(propertyDocRef, { idField: 'id' }) as Observable<Property>;
    }

    // Add new property
    addProperty(property: Property) {
        const propertiesCollection = collection(this.firestore, 'properties');
        return addDoc(propertiesCollection, property);
    }

    // Update property
    updateProperty(id: string, data: any) {
        const propertyDocRef = doc(this.firestore, `properties/${id}`);
        return updateDoc(propertyDocRef, data);
    }

    // Delete property
    deleteProperty(id: string) {
        const propertyDocRef = doc(this.firestore, `properties/${id}`);
        return deleteDoc(propertyDocRef);
    }
}
