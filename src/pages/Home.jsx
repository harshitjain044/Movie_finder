import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { fetchTrendingMovies, searchMovies } from "../services/api";

export default function Home({ query, setQuery, setHandleSearch }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ✅ Trending movies default load
  useEffect(() => {
    fetchTrendingMovies().then(setMovies);
  }, []);

  // ✅ Search handle function
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const results = await searchMovies(query);
    setMovies(results);
  };

  // ✅ App.jsx ko search function de diye
  useEffect(() => {
    setHandleSearch(() => handleSearch);
  }, [query]);

  return (
    <div className="p-6">
      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={setSelectedMovie}
            />
          ))
        ) : (
          <p className="text-center col-span-full">No movies found</p>
        )}
      </div>

      {/* Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
