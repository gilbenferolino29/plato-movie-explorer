import React, { useEffect, useRef } from 'react';
import { Movie } from '../models';

function MovieCarousel({ npMovies, npLoading } : { npMovies: Movie[], npLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const interval = setInterval(() => {
      if (scrollAmount >= maxScrollLeft) {
        scrollAmount = 0;
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollAmount += scrollStep;
        container.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 5);

    return () => clearInterval(interval);
  }, [npMovies]);

  return (
    <div className="w-full h-full p-4 relative">
      <div className="absolute top-2 left-4 text-white text-lg font-semibold z-10 bg-blue-950 px-3 py-1 rounded-md shadow-md">
        Now in Theatres
      </div>

      {!npLoading && npMovies.length > 0 && (
        <div
          ref={scrollRef}
          className="flex items-center overflow-x-auto whitespace-nowrap no-scrollbar h-full scroll-smooth"
        >
          <ul className="flex h-[90%] gap-9">
            {npMovies.map((movie) => (
              <li
                key={movie.id}
                className="bg-gray-800 p-4 rounded-2xl shadow-md flex-shrink-0 flex gap-4 w-[200px]"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : 'https://via.placeholder.com/200x300?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-fit h-auto rounded-md object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MovieCarousel;
