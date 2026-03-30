import { useCallback, useEffect, useMemo, useState } from "react";
import DiscoveryFilters from "../components/DiscoveryFilters";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import PageSearchHeader from "../components/PageSearchHeader";
import SkeletonCard from "../components/SkeletonCard";
import useMovieWatchProviders from "../hooks/useMovieWatchProviders";
import { fetchGenres, fetchTrendingMovies, searchMovies } from "../services/api";
import {
  createDefaultFilters,
  filterAndSortMovies,
  getMovieFilterOptions,
} from "../utils/movieFilters";

export default function Home({ query, setQuery, setHandleSearch }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(createDefaultFilters);
  const { providerMap, availableProviders } = useMovieWatchProviders(movies);

  const loadTrending = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsSearching(false);

    try {
      const data = await fetchTrendingMovies();
      setMovies(data);
    } catch (err) {
      setMovies([]);
      setError(err.message || "Unable to load trending movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch {
        setGenres([]);
      }
    };

    loadGenres();
  }, []);

  const handleSearch = useCallback(async (event, nextQuery = query) => {
    event?.preventDefault?.();

    const searchTerm = nextQuery.trim();

    if (!searchTerm) {
      loadTrending();
      return;
    }

    setLoading(true);
    setError("");
    setIsSearching(true);

    try {
      const results = await searchMovies(searchTerm);
      setMovies(results);
    } catch (err) {
      setMovies([]);
      setError(err.message || "Unable to search movies right now.");
    } finally {
      setLoading(false);
    }
  }, [loadTrending, query]);

  useEffect(() => {
    setHandleSearch(() => handleSearch);
  }, [handleSearch, setHandleSearch]);

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
        title={isSearching ? `Results for "${query.trim()}"` : "Trending Movies This Week"}
        description="Search from any page and open any title for rich details, cast, reviews, and similar movies."
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        rightContent={
          <>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
              {loading ? "Loading..." : `${visibleMovies.length} matches`}
            </span>
            {isSearching && (
              <button
                onClick={() => {
                  setQuery("");
                  loadTrending();
                }}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Back to Trending
              </button>
            )}
          </>
        }
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

      {!loading && !error && visibleMovies.length === 0 && (
        <div className="mb-6 rounded-3xl border border-dashed border-gray-300 bg-white/70 px-6 py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">No movies found</p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Try another filter combination, shorter keyword, or head back to trending movies.
          </p>
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

      <MovieModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
