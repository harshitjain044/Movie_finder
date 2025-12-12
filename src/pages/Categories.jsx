import { useEffect, useState } from "react";
import { fetchGenres, fetchMoviesByGenre } from "../services/api";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import MovieModal from "../components/MovieModal";

export default function Categories() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('28'); // Default to Action genre
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);


  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;

    setLoading(true);
    fetchMoviesByGenre(selectedGenre).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [selectedGenre]);

  return (
    <div className="p-6">
      
      {/* Hero Banner */}
      <div className="
        w-full bg-gradient-to-r 
        from-blue-600 via-blue-500 to-blue-400
        dark:from-blue-900 dark:via-blue-800 dark:to-blue-700
        text-white rounded-2xl shadow-lg p-8 mb-10
      ">
        <h1 className="text-4xl font-extrabold mb-2">🎬 Explore by Categories</h1>
        <p className="text-lg opacity-90">
          Discover movies from different genres. Pick your favorite theme and explore!
        </p>
      </div>

      {/* Genre Chips */}
      <div className="flex gap-4 flex-wrap mb-10">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`
              px-5 py-2 rounded-full font-medium transition-all
              border flex items-center gap-2 shadow-sm 
              hover:scale-105 hover:shadow-md
              ${
                selectedGenre === genre.id
                  ? "bg-blue-600 text-white border-blue-700 shadow-md"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600"
              }
            `}
          >
            🎬 {genre.name}
          </button>
        ))}
        { console.log(selectedGenre)}
        {}
      </div>

      {/* Category Title */}
      {selectedGenre && (
        <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-200">
          🎭 {genres.find((g) => g.id === selectedGenre)?.name} Movies
        </h3>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
  {loading
    ? Array.from({ length: 14 }).map((_, i) => <SkeletonCard key={i} />)
    : movies.map((movie, index) => (
        <div
          key={movie.id}
          className="animate-scaleUp"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <MovieCard 
            movie={movie} 
            onClick={setSelectedMovie}   // ⭐ IMPORTANT
          />
        </div>
      ))}
</div>


      {/* Empty State */}
      {!loading && selectedGenre && movies.length === 0 && (
        <div className="text-center mt-10 flex flex-col items-center animate-fadeIn">
          <span className="text-6xl mb-3">😕</span>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No movies found in this category.
          </p>
        </div>
      )}
      <MovieModal
  movie={selectedMovie}
  isOpen={!!selectedMovie}
  onClose={() => setSelectedMovie(null)}
/>

    </div>
  );
}
