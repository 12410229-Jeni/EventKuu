import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase EventKu
const firebaseConfig = {
  apiKey: "AIzaSyBqH3lcuO8N4crjszdA81whVAV55lRCAVg",
  authDomain: "final-project-2649f.firebaseapp.com",
  projectId: "final-project-2649f",
  storageBucket: "final-project-2649f.firebasestorage.app",
  messagingSenderId: "343074393149",
  appId: "1:343074393149:web:f2f191e6bc7934f0a1ae54",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firebase Firestore Database
export const db = getFirestore(app);

// Firebase Storage untuk file poster dan bukti pembayaran
export const storage = getStorage(app);

export default app;