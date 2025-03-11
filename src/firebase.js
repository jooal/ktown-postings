// src/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Replace these keys with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyA1L1CzFhjHfP9_pzck_Zr0Kq7JkNHu5iQ",
  authDomain: "k-town-958d4.firebaseapp.com",
  projectId: "k-town-958d4",
  storageBucket: "k-town-958d4.firebasestorage.app",
  messagingSenderId: "999340010106",
  appId: "1:999340010106:web:ca13754469874bd73629c3",
  measurementId: "G-LPEN1B0M5N",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
// Export Firebase utilities for use in your app
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export default firebase;
