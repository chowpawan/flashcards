import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDv-JiOsebg1rKEwdcLh3XlTlvMVpCeTyg",
  authDomain: "flashcards-b446e.firebaseapp.com",
  projectId: "flashcards-b446e",
  storageBucket: "flashcards-b446e.appspot.com",
  messagingSenderId: "910296769065",
  appId: "1:910296769065:web:d915ff5b374a65a0a07238",
  measurementId: "G-20P879W3TM"
};
const app = initializeApp(firebaseConfig);   
const db=getFirestore(app);
export {db}   
