// Demo data script for testing seller/customer separation
// Run this in browser console after logging into Firebase

const demoUsers = [
  {
    uid: "DEMO_SELLER_UID",
    email: "seller@test.com", 
    displayName: "Demo Seller",
    role: "seller",
    aadhaarNumber: "123456789012",
    panNumber: "",
    drivingLicense: "",
    phoneNumber: "",
    isVerified: false,
    isBlocked: false,
    reportCount: 0,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    uid: "DEMO_CUSTOMER_UID", 
    email: "customer@test.com",
    displayName: "Demo Customer", 
    role: "customer",
    aadhaarNumber: "987654321098",
    panNumber: "",
    drivingLicense: "",
    phoneNumber: "",
    isVerified: false,
    isBlocked: false,
    reportCount: 0,
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

const demoProperty = {
  id: "DEMO_PROPERTY_1",
  title: "Demo Seller Property",
  description: "Beautiful 3BHK apartment for sale",
  sellerId: "DEMO_SELLER_UID",
  sellerName: "Demo Seller",
  price: 5000000,
  type: "sale",
  category: "apartment",
  location: "Mumbai, Maharashtra",
  area: 1200,
  bedrooms: 3,
  bathrooms: 2,
  images: [],
  amenities: ["Parking", "Gym", "Swimming Pool"],
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log("Demo Users to Add:");
console.log(JSON.stringify(demoUsers, null, 2));
console.log("\nDemo Property to Add:");
console.log(JSON.stringify(demoProperty, null, 2));

// Instructions for manual addition
console.log("\n=== MANUAL FIRESTORE SETUP ===");
console.log("1. Go to Firebase Console > Firestore Database");
console.log("2. Create 'users' collection");
console.log("3. Add documents with IDs: DEMO_SELLER_UID, DEMO_CUSTOMER_UID");
console.log("4. Create 'properties' collection"); 
console.log("5. Add document with ID: DEMO_PROPERTY_1");