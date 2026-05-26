import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDXCBb4yUp__xkAmWDs-SGzrkyYs7Dimao",
  authDomain: "tarrot-f774d.firebaseapp.com",
  projectId: "tarrot-f774d",
  storageBucket: "tarrot-f774d.firebasestorage.app",
  messagingSenderId: "34041235207",
  appId: "1:34041235207:web:6209a09c757dc19d29a7a2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);