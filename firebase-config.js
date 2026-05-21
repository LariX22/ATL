// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqH8xSQdO4j5_o1czjej9TIkYjfk5Se3c",
  authDomain: "aliancatl.firebaseapp.com",
  projectId: "aliancatl",
  storageBucket: "aliancatl.firebasestorage.app",
  messagingSenderId: "347098558078",
  appId: "1:347098558078:web:fbd56b1804c11caec6f22f",
  measurementId: "G-V1YXPE3VHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);