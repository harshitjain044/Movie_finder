import { useEffect, useMemo, useState } from "react";
import DiscoveryFilters from "../components/DiscoveryFilters";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import PageSearchHeader from "../components/PageSearchHeader";
import SkeletonCard from "../components/SkeletonCard";
import useMovieWatchProviders from "../hooks/useMovieWatchProviders";
import { fetchGenres, fetchTrendingMovies } from "../services/api";
import {
  createDefaultFilters,
  filterAndSortMovies,
  getMovieFilterOptions,
} from "../utils/movieFilters";

export default function Trending({ query, setQuery, handleSearch }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState(createDefaultFilters);
  const { providerMap, availableProviders } = useMovieWatchProviders(movies);

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTrendingMovies();
        setMovies(data || []);
      } catch (err) {
        setMovies([]);
        setError(err.message || "Unable to load trending movies.");
      } finally {
        setLoading(false);
      }
    };

    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch {
        setGenres([]);
      }
    };

    loadTrending();
    loadGenres();
  }, []);

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
        title="Trending Movies This Week"
        description="Search from anywhere, then explore what viewers are discovering most this week."
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />

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
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No trending movies match the current filters.
        </p>
      )}

      <MovieModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
