import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-RuA7jH7kNudrIHniiX7JSNZAIR5nVbY",
  authDomain: "maptesttask-dc67e.firebaseapp.com",
  projectId: "maptesttask-dc67e",
  storageBucket: "maptesttask-dc67e.appspot.com",
  messagingSenderId: "332336951724",
  appId: "1:332336951724:web:6bfcc27bb3b25541678a09"
};

const data= initializeApp(firebaseConfig);
const db = getFirestore(data);
export const colRef = collection(db, 'Pins');