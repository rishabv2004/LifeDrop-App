import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 1. Jo config Firebase se copy kiya hai, use yahan replace kar do
const firebaseConfig = {
  apiKey: "AIzaSyByJTYMKZ8Y9ozb3nFAK-HX3kALZGaStpA",
  authDomain: "lifedrop-8d5eb.firebaseapp.com",
  projectId: "lifedrop-8d5eb",
  storageBucket: "lifedrop-8d5eb.firebasestorage.app",
  messagingSenderId: "449132301256",
  appId: "1:449132301256:web:d8ab81b02d0d0516390efd",
  measurementId: "G-717P04RS48"
};

// 2. Firebase initialize karo
const app = initializeApp(firebaseConfig);

// 3. Database aur Auth ko export karo taaki screens mein use kar sakein
export const db = getFirestore(app);
export const auth = getAuth(app);