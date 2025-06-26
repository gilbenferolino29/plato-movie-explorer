"use client";
import dayjs from "dayjs";
import React, { use, useEffect, useState } from "react";

import { Movie } from "./models/movie.model";
import { fetchMoviesByCategory, searchMovies } from "./utils/api/tmdb-api";
import { MovieCategory } from "./models";
import { formatDate } from "./utils/helpers";
import MovieCarousel from "./components/MovieCarousel";

const CATEGORY_OPTIONS = [
  { label: "Popular", value: MovieCategory.Popular },
  { label: "Top Rated", value: MovieCategory.TopRated },
  { label: "Upcoming", value: MovieCategory.Upcoming },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [npMovies, setNPMovies] = useState<Movie[]>([]);
  const [npLoading, setNPLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<MovieCategory | string>(MovieCategory.Popular);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    updateMovies();
  }, [category]);

  const loadMovies = async () => {
    setLoading(true);
    setNPLoading(true);
    try {
      const results = await fetchMoviesByCategory(category);
      const npResults = await fetchMoviesByCategory(MovieCategory.NowPlaying);
      setMovies(results);
      setNPMovies(npResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setNPLoading(false);
    }
  };

  const updateMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchMoviesByCategory(category);
      setMovies(results);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetCategory = (category: MovieCategory) => {
    setCategory(category);
    setQuery("");
  };


return (
  <div className="min-h-screen bg-white">
    {/* Header */}
    <div className="flex items-center bg-blue-950 h-16 shadow-md px-6 sm:px-12">
      <h1 className="text-white text-xl sm:text-2xl font-bold">
        Plato's Movie Explorer
      </h1>
    </div>

    {/* Hero Section */}
    <div className="flex flex-col md:flex-row h-auto md:h-[40vh] bg-gradient-to-r from-blue-950 to-blue-800 w-full text-white">
      <div className="w-full md:w-[40%] px-6 md:px-[90px] py-10 md:py-[120px]">
        <h1 className="text-2xl sm:text-3xl font-bold">Movies to Watch and Discover.</h1>
        <h1 className="text-2xl sm:text-3xl font-bold">Anytime. Anywhere.</h1>
      </div>
      <div className="w-full md:w-[60%] px-4 md:px-0">
        <MovieCarousel npMovies={npMovies} npLoading={npLoading} />
      </div>
    </div>

    {/* Content Section */}
    <div className="flex flex-col md:flex-row bg-blue-950 h-auto md:h-[55%]">
      
      {/* Sidebar */}
      <div className="w-full md:w-[20%] bg-gray-700 p-4 flex flex-wrap md:block">
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSetCategory(opt.value)}
            className={`w-full py-2 rounded-md mb-2 ${
              category === opt.value ? 'bg-blue-950 text-white' : 'bg-gray-700 text-white'
            } hover:cursor-pointer`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[80%] min-h-[45vh] p-4">
        <form onSubmit={handleSearch} className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md shadow-sm text-black bg-amber-50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-700 rounded-md hover:bg-white hover:cursor-pointer text-white hover:text-black"
          >
            Search
          </button>
        </form>

        <div className="max-h-[45vh] overflow-y-auto style-scrollbar">
          {loading && <p className="text-center text-white">Loading...</p>}

          {!loading && movies.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="bg-gray-800 p-4 rounded-2xl shadow-md flex gap-4"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-24 h-auto rounded-md object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {movie.title}
                    </h2>
                    {movie.release_date && (
                      <p className="text-sm text-gray-400">
                        {formatDate(movie.release_date)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && !movies.length && (
            <p className="text-center text-gray-400">No results found.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

}
