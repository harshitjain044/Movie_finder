import { useEffect, useMemo, useState } from "react";
import { fetchMovieWatchProviders } from "../services/api";

export default function useMovieWatchProviders(movies) {
  const [providerMap, setProviderMap] = useState({});

  useEffect(() => {
    const movieIds = movies.map((movie) => movie.id).filter(Boolean);

    if (movieIds.length === 0) {
      setProviderMap({});
      return;
    }

    let active = true;

    const loadProviders = async () => {
      const results = await Promise.all(
        movies.map(async (movie) => {
          try {
            const data = await fetchMovieWatchProviders(movie.id);
            return [movie.id, data];
          } catch {
            return [movie.id, null];
          }
        }),
      );

      if (!active) {
        return;
      }

      setProviderMap(Object.fromEntries(results));
    };

    loadProviders();

    return () => {
      active = false;
    };
  }, [movies]);

  const availableProviders = useMemo(() => {
    const providerNames = Object.values(providerMap)
      .flatMap((entry) => entry?.providers || [])
      .map((provider) => provider.provider_name);

    return [...new Set(providerNames)].sort((left, right) => left.localeCompare(right));
  }, [providerMap]);

  return { providerMap, availableProviders };
}
