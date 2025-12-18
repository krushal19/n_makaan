/**
 * STANDALONE SCRIPT TO CREATE DEMO CUSTOMER ACCOUNT
 * 
 * This is a standalone TypeScript/JavaScript function that can be run
 * in the browser console or as a one-time initialization script.
 * 
 * USAGE INSTRUCTIONS:
 * 
 * Option 1: Browser Console (Easiest)
 * ------------------------------------
 * 1. Run your app: npm start
 * 2. Navigate to any page (e.g., http://localhost:4200)
 * 3. Open browser console (F12)
 * 4. Paste the code from BROWSER_CONSOLE_VERSION.txt
 * 5. Press Enter
 * 
 * Option 2: Temporary Component Button
 * -------------------------------------
 * 1. Use the create-demo-account.component.ts file
 * 2. Add route in app.routes.ts:
 *    { path: 'create-demo', component: CreateDemoAccountComponent }
 * 3. Navigate to /create-demo
 * 4. Click the button
 * 5. Remove the route after creating the account
 * 
 * Option 3: Run Once in App Initialization
 * -----------------------------------------
 * Add this code to app.component.ts ngOnInit() with a flag check
 */

// ============================================
// BROWSER CONSOLE VERSION
// ============================================
// Copy this entire block and paste in browser console:

/*
(async function createDemoAccount() {
  // Get Firebase Auth and Firestore instances
  const auth = window.ng.getInjector(document.querySelector('app-root')).get('Auth');
  const firestore = window.ng.getInjector(document.querySelector('app-root')).get('Firestore');
  
  try {
    console.log('🔄 Creating demo customer account...');
    
    // Import Firebase functions
    const { createUserWithEmailAndPassword } = await import('@angular/fire/auth');
    const { doc, setDoc } = await import('@angular/fire/firestore');
    
    // Create Firebase Auth user
    const credential = await createUserWithEmailAndPassword(
      auth,
      'demo_customer@example.com',
      'Demo@123'
    );
    
    const user = credential.user;
    console.log('✅ Firebase Auth user created:', user.uid);
    
    // Create user profile object
    const userProfile = {
      uid: user.uid,
      name: 'Demo User',
      email: 'demo_customer@example.com',
      role: 'customer',
      createdAt: new Date(),
      photoURL: ''
    };
    
    // Save to /users collection
    const userRef = doc(firestore, `users/${user.uid}`);
    await setDoc(userRef, userProfile);
    console.log('✅ User document created in /users');
    
    // Save to /customers collection
    const customerRef = doc(firestore, `customers/${user.uid}`);
    await setDoc(customerRef, userProfile);
    console.log('✅ User document created in /customers');
    
    console.log('');
    console.log('🎉 DEMO ACCOUNT CREATED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    demo_customer@example.com');
    console.log('Password: Demo@123');
    console.log('Role:     customer');
    console.log('UID:      ' + user.uid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('You can now login at: /login');
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Demo account already exists!');
      console.log('Email: demo_customer@example.com');
      console.log('Password: Demo@123');
    } else {
      console.error('❌ Error creating demo account:', error);
    }
  }
})();
*/


// ============================================
// ANGULAR SERVICE METHOD VERSION
// ============================================
// Add this method to any service or component:

export class DemoAccountCreator {

    /**
     * Creates a demo customer account using AuthService
     * Call this method once during app initialization or from a button
     */
    static async createDemoCustomerAccount(authService: any): Promise<void> {
        try {
            console.log('🔄 Creating demo customer account...');

            await authService.registerUser(
                'demo_customer@example.com',
                'Demo@123',
                'Demo User',
                'customer'
            );

            console.log('✅ Demo customer account created successfully!');
            console.log('Email: demo_customer@example.com');
            console.log('Password: Demo@123');
            console.log('Role: customer');

            return Promise.resolve();

        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('⚠️ Demo account already exists!');
                console.log('Email: demo_customer@example.com');
                console.log('Password: Demo@123');
            } else {
                console.error('❌ Error:', error.message);
                throw error;
            }
        }
    }
}


// ============================================
// APP.COMPONENT.TS INITIALIZATION VERSION
// ============================================
// Add this to your app.component.ts:

/*
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  async ngOnInit() {
    // Check if demo account should be created
    const shouldCreateDemo = localStorage.getItem('demo_account_created') !== 'true';

    if (shouldCreateDemo) {
      try {
        await this.authService.registerUser(
          'demo_customer@example.com',
          'Demo@123',
          'Demo User',
          'customer'
        );

        localStorage.setItem('demo_account_created', 'true');
        console.log('✅ Demo account created!');
        console.log('Email: demo_customer@example.com');
        console.log('Password: Demo@123');

      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          localStorage.setItem('demo_account_created', 'true');
          console.log('⚠️ Demo account already exists');
        }
      }
    }
  }
}
*/


// ============================================
// DIRECT FIREBASE ADMIN SDK VERSION (Backend)
// ============================================
// For backend/seed.js or similar:

/*
const admin = require('firebase-admin');

async function createDemoCustomer() {
  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: 'demo_customer@example.com',
      password: 'Demo@123',
      displayName: 'Demo User'
    });
    
    console.log('✅ Auth user created:', userRecord.uid);
    
    // Create Firestore documents
    const userProfile = {
      uid: userRecord.uid,
      name: 'Demo User',
      email: 'demo_customer@example.com',
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      photoURL: ''
    };
    
    // Save to /users
    await admin.firestore().collection('users').doc(userRecord.uid).set(userProfile);
    console.log('✅ Document created in /users');
    
    // Save to /customers
    await admin.firestore().collection('customers').doc(userRecord.uid).set(userProfile);
    console.log('✅ Document created in /customers');
    
    console.log('🎉 Demo customer account created!');
    console.log('Email: demo_customer@example.com');
    console.log('Password: Demo@123');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createDemoCustomer();
*/
