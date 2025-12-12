import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { fetchTrendingMovies, searchMovies } from "../services/api";

export default function Home({ query, setQuery, setHandleSearch }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Load trending movies
  const loadTrending = () => {
    setLoading(true);
    setIsSearching(false);
    fetchTrendingMovies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTrending();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setIsSearching(true);

    const results = await searchMovies(query);
    setMovies(results);
    setLoading(false);
  };

  // Expose handleSearch to Navbar
  useEffect(() => {
    setHandleSearch(() => handleSearch);
  }, [query]);

  return (
    <div className="p-6">

      {/* 🔙 BACK BUTTON WHEN SEARCHING */}
      {isSearching && (
        <button
          onClick={() => {
            setQuery("");   // clear search box
            loadTrending(); // load trending again
          }}
          className="
  mb-4 px-5 py-2 
  rounded-xl font-medium
  bg-gradient-to-r from-gray-800 to-gray-600 
  dark:from-gray-700 dark:to-gray-500
  text-white 
  shadow-md 
  hover:shadow-lg 
  hover:scale-[1.03]
  transition-all duration-300
"

        >
          ⬅ Back to Trending
        </button>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton rounded-xl h-80 w-full" />
          ))
          : movies.length > 0
            ? movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={setSelectedMovie}
              />
            ))
            : (
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
