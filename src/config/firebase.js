import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyCWKjB40PmZ9SNAgEb-Q9PdFXJPeh2pne0",
  authDomain: "monthly-expense-tracker-webapp.firebaseapp.com",
  projectId: "monthly-expense-tracker-webapp",
  storageBucket: "monthly-expense-tracker-webapp.firebasestorage.app",
  messagingSenderId: "320214014462",
  appId: "1:320214014462:web:03b6c4d1208c21256cc8af"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
