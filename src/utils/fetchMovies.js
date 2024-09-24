import API_HEADERS from '../utils/constants'
  
  export const fetchMovies = async (url, list) => {
    try {
      const response = await fetch(url, API_HEADERS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      list.value = data.results; 
    } catch (error) {

      list.value=error;
    
    }
  };
  