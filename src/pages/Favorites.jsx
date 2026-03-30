import { useContext, useEffect, useMemo, useState } from "react";
import DiscoveryFilters from "../components/DiscoveryFilters";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import PageSearchHeader from "../components/PageSearchHeader";
import { FavoritesContext } from "../context/FavoritesContext";
import useMovieWatchProviders from "../hooks/useMovieWatchProviders";
import { fetchGenres } from "../services/api";
import {
  createDefaultFilters,
  filterAndSortMovies,
  getMovieFilterOptions,
} from "../utils/movieFilters";

export default function Favorites({ query, setQuery, handleSearch }) {
  const { favorites } = useContext(FavoritesContext);
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filters, setFilters] = useState(createDefaultFilters);
  const { providerMap, availableProviders } = useMovieWatchProviders(favorites);

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

  const filterOptions = useMemo(
    () => getMovieFilterOptions(favorites, genres, availableProviders),
    [availableProviders, favorites, genres],
  );

  const visibleFavorites = useMemo(
    () => filterAndSortMovies(favorites, filters, providerMap),
    [favorites, filters, providerMap],
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageSearchHeader
        title="Your Favorite Movies"
        description="Search from here or browse the titles you have already saved."
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 px-6 py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">No favorites yet</p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Open any movie card and use the favorites button to save it here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Saved Movies
            </h2>
            <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {visibleFavorites.length} matches
            </span>
          </div>

          <DiscoveryFilters
            filters={filters}
            setFilters={setFilters}
            options={filterOptions}
          />

          {visibleFavorites.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 px-6 py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                No favorites match the current filters
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Try clearing filters to see your full saved list again.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleFavorites.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onQuickView={setSelectedMovie}
                  watchInfo={providerMap[movie.id]}
                />
              ))}
            </div>
          )}
        </>
      )}

      <MovieModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
