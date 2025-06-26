import { Movie } from "../../models/movie.model";

  
  const BASE_URL = "https://api.themoviedb.org/3";
  const SEARCH_URL = `${BASE_URL}/search/movie`;
  const CATEGORY_MOVIES_URL = `${BASE_URL}/movie`;
  
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;
  const AUTH_HEADER = {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
  };

  if (!API_KEY || !BEARER_TOKEN) {
    throw new Error("Missing TMDB API credentials in environment variables.");
  }
  
  export const searchMovies = async (query: string): Promise<Movie[]> => {
    if (!query) return [];
  
    const url = `${SEARCH_URL}?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
    console.log(url);
    const response = await fetch(url, {
      headers: AUTH_HEADER,
      cache: 'no-store'
    });
  
    if (!response.ok) {
      throw new Error(`Error fetching movies: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.results as Movie[];
  };

  export async function fetchMoviesByCategory(category = "popular") {
    const res = await fetch(`${CATEGORY_MOVIES_URL}/${category}`, {
      headers: AUTH_HEADER,
    });

    console.log(AUTH_HEADER);
  
    if (!res.ok) {
      throw new Error("Failed to fetch movies by category");
    }
  
    const data = await res.json();
    return data.results || [];
  }
  