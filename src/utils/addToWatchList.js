import { db } from './firebase'; 
import { collection, addDoc } from "firebase/firestore";

export const addToWatchList = async (userId, movieId) => {
  try {
    const watchlistRef = collection(db, `users/${userId}/watchlist`);
    const movieData = {
      movieId: movieId
    };
    
    await addDoc(watchlistRef, movieData);
    console.log("Movie added to watchlist!");
  } catch (error) {
    console.error("Error adding movie to watchlist: ", error);
  }
};
