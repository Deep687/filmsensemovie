import { defineStore } from 'pinia';
import { db } from '../utils/firebase'; 
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useUserStore } from '../stores/userStore';


export const useWatchlistStore = defineStore('watchlist', {
  state: () => ({
    watchlist: [],
    isMovieInWatchlist: false,
  }), 
  
  actions: {
    async fetchWatchlist() {
const userStore=useUserStore();
const userId= userStore.user?.uid;
      if (!userStore.user?.uid) return; 
      try {
        const watchlistRef = collection(db, `users/${userId}/watchlist`);
        const watchlistSnapshot = await getDocs(watchlistRef);
        this.watchlist = watchlistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching watchlist: ", error);
      }
    },
        
    
    async addMovieToWatchList(movieDetails, movieId) {
      const userStore = useUserStore();
      const userId = userStore.user?.uid;
    
      if (!userId) {
        alert("Please log in to add movies to your watchlist.");
        return;
      }
  
      const isAlreadyInWatchlist = this.watchlist.some(movie => movie.movieId === movieId);
      if (isAlreadyInWatchlist) {
        this.isMovieInWatchlist = true;
        alert("This movie is already in your watchlist.");
        return;
      }
    
      const movieData = {
        movieId,
        title: movieDetails.title,
        tagline: movieDetails.tagline,
        ratings: movieDetails.vote_average,
        releaseDate: movieDetails.release_date,
        posterPath:movieDetails.poster_path
      };
    
      try {
        const watchlistRef = collection(db, `users/${userId}/watchlist`);
        const docRef = doc(watchlistRef, movieId); 
        await setDoc(docRef, movieData);
        
        this.watchlist.push(movieData);
        this.isMovieInWatchlist = true;

  
      } catch (error) {
        console.error("Error adding movie to watchlist: ", error);
      }
    },
    
    async removeMovie(movieId) {
      const userStore = useUserStore();
      const userId = userStore.user?.uid;
      if (!userId) return;
      try {
        await deleteDoc(doc(db, `users/${userId}/watchlist`, movieId));
        
        this.watchlist = this.watchlist.filter(movie => movie.movieId !== movieId);
        this.isMovieInWatchlist = false;

        console.log("Movie removed from watchlist: ", movieId);
      } catch (error) {
        console.error("Error removing movie from watchlist: ", error);
      }
    },
  },
});
