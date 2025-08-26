import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrKLRFzBQ331aolycbO_kMUMG_hYBnaYE",
  authDomain: "nmg-commerce.firebaseapp.com",
  projectId: "nmg-commerce",
  storageBucket: "nmg-commerce.firebasestorage.app",
  messagingSenderId: "834236097234",
  appId: "1:834236097234:web:cd73f5a640723a3eab830b"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };