export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  role: 'admin' | 'seller' | 'customer';
  createdAt?: any;
  sellerId?: string;
}
