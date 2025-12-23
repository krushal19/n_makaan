// Simple test script to create test users
// This is for testing purposes only

const testUsers = [
  {
    email: 'seller1@test.com',
    password: 'test123',
    displayName: 'John Seller',
    role: 'seller',
    aadhaarNumber: '123456789012'
  },
  {
    email: 'customer1@test.com', 
    password: 'test123',
    displayName: 'Jane Customer',
    role: 'customer',
    aadhaarNumber: '987654321098'
  }
];

console.log('Test users for manual registration:');
testUsers.forEach(user => {
  console.log(`Email: ${user.email}, Password: ${user.password}, Role: ${user.role}, Name: ${user.displayName}`);
});