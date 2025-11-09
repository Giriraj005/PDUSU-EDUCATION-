import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuY55eIVRbVYQwYauEAHQIyE1gLbWaNSk",
  authDomain: "pdusu-education.firebaseapp.com",
  projectId: "pdusu-education",
  storageBucket: "pdusu-education.firebasestorage.app",
  messagingSenderId: "339823472069",
  appId: "1:339823472069:web:acf5de2a1cc03772572fac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
