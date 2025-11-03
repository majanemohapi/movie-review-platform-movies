// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// YOUR CONFIG (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDoxkyPL1TAfQPGHxmFiwkh150G4UcBieY",
  authDomain: "firestore-database-9a55d.firebaseapp.com",
  projectId: "firestore-database-9a55d",
  storageBucket: "firestore-database-9a55d.firebasestorage.app",
  messagingSenderId: "824781168679",
  appId: "1:824781168679:web:dabb2a30b9410734ab6e02",
  measurementId: "G-9FB7BW6J2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export what we need
export const db = getFirestore(app);   // For reviews (Firestore)
export const auth = getAuth(app);      // For user login