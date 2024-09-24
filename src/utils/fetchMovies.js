import API_HEADERS from '../utils/constants'
  
  export const fetchMovies = async (url, list) => {
    try {
      const res = await fetch(url, API_HEADERS);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      list.value = data.results; 
    } catch (error) {
      console.error('Fetch error: ', error);
      list.value=error;
    
    }
  };
  