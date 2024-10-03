import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh8fQVIqaQJCO-GtGYr6V06U2bccJz9Ao",
  authDomain: "filmsense-a7c97.firebaseapp.com",
  projectId: "filmsense-a7c97",
  storageBucket: "filmsense-a7c97.appspot.com",
  messagingSenderId: "1018418110458",
  appId: "1:1018418110458:web:a096b5b5d1cc0bc07bce43",
  measurementId: "G-TDXT3PZY5D",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
export const auth = getAuth();


 
