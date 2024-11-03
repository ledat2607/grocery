// // Import the functions you need from the SDKs you need
// import { getApp, initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBQibrlNt0R6CcvnHwNiy5ZLDPydr3fWaE",
//   authDomain: "grocery-e6fdd.firebaseapp.com",
//   projectId: "grocery-e6fdd",
//   storageBucket: "grocery-e6fdd.appspot.com",
//   messagingSenderId: "483651103141",
//   appId: "1:483651103141:web:b5d3b2c2d95ef69e9c604c",
//   measurementId: "G-9LNNMS42JH",
// };

// // Initialize Firebase
// const app = getApp.length > 0 ? getApp() : initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { db, storage };
// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQibrlNt0R6CcvnHwNiy5ZLDPydr3fWaE",
  authDomain: "grocery-e6fdd.firebaseapp.com",
  projectId: "grocery-e6fdd",
  storageBucket: "grocery-e6fdd.appspot.com",
  messagingSenderId: "483651103141",
  appId: "1:483651103141:web:b5d3b2c2d95ef69e9c604c",
  measurementId: "G-9LNNMS42JH"
};

const app = getApp.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };