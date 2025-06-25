// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuOUyo-cyECYfg3rPtBxt9i3e7qPVnkgA",
  authDomain: "e-commerce-b9035.firebaseapp.com",
  projectId: "e-commerce-b9035",
  storageBucket: "e-commerce-b9035.appspot.com",
  messagingSenderId: "347500877074",
  appId: "1:347500877074:web:0adf4c6ad78f79b5d7cfcb",
  measurementId: "G-S1GVXJM0H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
