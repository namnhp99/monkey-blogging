import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBrYVvka-s8JgduN1QzG93lYrlXbljlJdU",
  authDomain: "monkey-blogging-39cb2.firebaseapp.com",
  projectId: "monkey-blogging-39cb2",
  storageBucket: "monkey-blogging-39cb2.appspot.com",
  messagingSenderId: "749328782368",
  appId: "1:749328782368:web:2222b47c06f8bc415d9845",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
