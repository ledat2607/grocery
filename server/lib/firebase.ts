// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCicJtt7-7o_UrcqSxzrG6ry0cbHs0QTMI",
  authDomain: "grocery-store-4e426.firebaseapp.com",
  projectId: "grocery-store-4e426",
  storageBucket: "grocery-store-4e426.appspot.com",
  messagingSenderId: "89428820805",
  appId: "1:89428820805:web:35c865e73b65550524342c",
  measurementId: "G-17PSFQ3E17",
};

// Initialize Firebase
const app = getApp.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
