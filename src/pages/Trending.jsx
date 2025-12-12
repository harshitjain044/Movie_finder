// src/pages/Trending.jsx
import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import MovieModal from "../components/MovieModal";

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // inside component

  useEffect(() => {
    setLoading(true);
    fetchTrendingMovies()
      .then((data) => {
        setMovies(data || []);
      })
      .catch((err) => {
        console.error("Error fetching trending:", err);
        setMovies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // debug to see selection
  useEffect(() => {
    console.log("selectedMovie changed:", selectedMovie?.title ?? selectedMovie);
  }, [selectedMovie]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        🔥 Trending Movies This Week
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={setSelectedMovie} // pass setter directly
              />
            ))}
      </div>

      {/* Movie Modal (bottom of page) */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
