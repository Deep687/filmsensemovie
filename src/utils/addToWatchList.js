import { db } from './firebase'; 
import { collection, addDoc } from "firebase/firestore";

import { doc, setDoc } from 'firebase/firestore';

export const addToWatchList = async (userId, movieData) => {
  try {
    const watchlistRef = collection(db, `users/${userId}/watchlist`);
    const docRef = doc(watchlistRef, movieData.movieId); 
    await setDoc(docRef, movieData);
    console.log("Movie added to watchlist: ", movieData.title);
  } catch (error) {
    console.error("Error adding movie to watchlist: ", error);
  }
};
