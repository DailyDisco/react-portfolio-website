import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDskRbM8fe7ddsvxTJJXTDtwUryYnMR8w4",
  authDomain: "portfolio-f9871.firebaseapp.com",
  projectId: "portfolio-f9871",
  storageBucket: "portfolio-f9871.appspot.com",
  messagingSenderId: "715905734721",
  appId: "1:715905734721:web:fadc5f3a54be8a519bcec0",
  measurementId: "G-Z7ZV8Q3D4X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);


export const signInWithGoogle = () => signInWithPopup(auth, provider);