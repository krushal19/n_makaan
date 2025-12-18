export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: 'customer' | 'seller' | 'admin';
    photoURL?: string;
    createdAt?: any;
    updatedAt?: any;
}
