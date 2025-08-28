import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export default app;