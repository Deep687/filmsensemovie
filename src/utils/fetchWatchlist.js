const fetchWatchList = async (userId) => {
    if (!userId) return; 
    try {
      const watchlistRef = collection(db, `users/${userId}/watchlist`);
      const watchlistSnapshot = await getDocs(watchlistRef);
      watchlist.value = watchlistSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
    
      isInWatchlist.value = watchlist.value.some(movie => movie.movieId === movieId.value);
      
      console.log(watchlist.value);
    } catch (error) {
      console.error("Error fetching watchlist: ", error);
    }
  };