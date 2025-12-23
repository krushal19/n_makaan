export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: 'admin' | 'seller' | 'customer';
  createdAt?: any;
  sellerId?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  drivingLicense?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  reportCount?: number;
  lastLogin?: any;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'rent' | 'sale';
  category: 'apartment' | 'house' | 'villa' | 'commercial';
  sellerId: string;
  sellerName: string;
  images: string[];
  amenities: string[];
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
  legalDocuments?: string[];
  isVerified?: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  sellerId: string;
  sellerName: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: any;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
  activityType: 'view' | 'inquiry' | 'purchase' | 'rent';
  timestamp: any;
}
