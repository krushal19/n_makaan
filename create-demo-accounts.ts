// Demo account creation script
// This will be used to create test accounts through the registration system

export const demoAccounts = {
  seller: {
    email: 'seller@test.com',
    password: 'test123',
    displayName: 'Demo Seller',
    role: 'seller' as const,
    aadhaarNumber: '123456789012'
  },
  customer: {
    email: 'customer@test.com', 
    password: 'test123',
    displayName: 'Demo Customer',
    role: 'customer' as const,
    aadhaarNumber: '987654321098'
  }
};

// Instructions:
// 1. Go to http://localhost:4201/register
// 2. Register Demo Seller first
// 3. Logout and register Demo Customer
// 4. Test login flows

console.log('Demo Accounts Ready:');
console.log('Seller:', demoAccounts.seller);
console.log('Customer:', demoAccounts.customer);