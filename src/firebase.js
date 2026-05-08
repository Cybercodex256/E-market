import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFPlNrFjbercNPc4u7IXG2vv5PNVHpmYg",
  authDomain: "e-marketing-platform-a02d1.firebaseapp.com",
  projectId: "e-marketing-platform-a02d1",
  storageBucket: "e-marketing-platform-a02d1.firebasestorage.app",
  messagingSenderId: "962648754227",
  appId: "1:962648754227:web:8f9c0393726024942a3b46",
  measurementId: "G-RCSS7KNMRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
