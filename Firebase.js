// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfksP9wLa7sznEWDXSRwhHsgcHNeRAxg8",
  authDomain: "donutweb-2bf64.firebaseapp.com",
  projectId: "donutweb-2bf64",
  storageBucket: "donutweb-2bf64.firebasestorage.app",
  messagingSenderId: "709582753728",
  appId: "1:709582753728:web:4a1f1bb40a28bd03f7c225"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };