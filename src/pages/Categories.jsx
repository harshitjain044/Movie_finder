import { useEffect, useMemo, useState } from "react";
import DiscoveryFilters from "../components/DiscoveryFilters";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import PageSearchHeader from "../components/PageSearchHeader";
import SkeletonCard from "../components/SkeletonCard";
import useMovieWatchProviders from "../hooks/useMovieWatchProviders";
import { fetchGenres, fetchMoviesByGenre } from "../services/api";
import {
  createDefaultFilters,
  filterAndSortMovies,
  getMovieFilterOptions,
} from "../utils/movieFilters";

export default function Categories({ query, setQuery, handleSearch }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(28);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState(createDefaultFilters);
  const { providerMap, availableProviders } = useMovieWatchProviders(movies);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        setGenres([]);
        setError(err.message || "Unable to load movie categories.");
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    if (!selectedGenre) {
      return;
    }

    const loadMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMoviesByGenre(selectedGenre);
        setMovies(data);
      } catch (err) {
        setMovies([]);
        setError(err.message || "Unable to load this category.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [selectedGenre]);

  const selectedGenreName = useMemo(
    () => genres.find((genre) => genre.id === selectedGenre)?.name ?? "Selected",
    [genres, selectedGenre],
  );

  const filterOptions = useMemo(
    () => getMovieFilterOptions(movies, genres, availableProviders),
    [availableProviders, genres, movies],
  );

  const visibleMovies = useMemo(
    () => filterAndSortMovies(movies, filters, providerMap),
    [filters, movies, providerMap],
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageSearchHeader
        title="Browse by Category"
        description="Search across the site or switch genres to discover more titles."
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />

      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedGenre === genre.id
                ? "border-blue-700 bg-blue-600 text-white shadow-md"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {selectedGenreName} Movies
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Curated results from TMDB for the selected genre.
          </p>
        </div>
        <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          {loading ? "Loading..." : `${visibleMovies.length} matches`}
        </span>
      </div>

      <DiscoveryFilters
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)
          : visibleMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onQuickView={setSelectedMovie}
                watchInfo={providerMap[movie.id]}
              />
            ))}
      </div>

      {!loading && !error && visibleMovies.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white/70 px-6 py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            No movies found in this category
          </p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Try switching the category or discovery filters to uncover more titles.
          </p>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
