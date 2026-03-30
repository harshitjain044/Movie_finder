export function getMovieFilterOptions(movies, genres, availableProviders) {
  const years = [...new Set(
    movies
      .map((movie) => movie.release_date?.slice(0, 4))
      .filter(Boolean),
  )].sort((left, right) => Number(right) - Number(left));

  const languages = [...new Set(
    movies
      .map((movie) => movie.original_language?.toUpperCase())
      .filter(Boolean),
  )].sort((left, right) => left.localeCompare(right));

  const genreIds = new Set(movies.flatMap((movie) => movie.genre_ids || []));
  const genreOptions = genres.filter((genre) => genreIds.has(genre.id));

  return {
    years,
    languages,
    genres: genreOptions,
    providers: availableProviders,
  };
}

export function filterAndSortMovies(movies, filters, providerMap) {
  const filteredMovies = movies.filter((movie) => {
    const matchesYear = filters.year === "all" || movie.release_date?.startsWith(filters.year);
    const matchesRating =
      filters.minRating === "all" || Number(movie.vote_average || 0) >= Number(filters.minRating);
    const matchesLanguage =
      filters.language === "all" ||
      movie.original_language?.toUpperCase() === filters.language;
    const matchesGenres =
      filters.genres.length === 0 ||
      filters.genres.every((genreId) => movie.genre_ids?.includes(genreId));
    const matchesProvider =
      filters.provider === "all" ||
      (providerMap[movie.id]?.providers || []).some(
        (provider) => provider.provider_name === filters.provider,
      );

    return (
      matchesYear &&
      matchesRating &&
      matchesLanguage &&
      matchesGenres &&
      matchesProvider
    );
  });

  return [...filteredMovies].sort((left, right) => {
    switch (filters.sortBy) {
      case "popularity.asc":
        return (left.popularity || 0) - (right.popularity || 0);
      case "rating.desc":
        return (right.vote_average || 0) - (left.vote_average || 0);
      case "release.desc":
        return new Date(right.release_date || 0) - new Date(left.release_date || 0);
      case "release.asc":
        return new Date(left.release_date || 0) - new Date(right.release_date || 0);
      case "title.asc":
        return (left.title || "").localeCompare(right.title || "");
      case "popularity.desc":
      default:
        return (right.popularity || 0) - (left.popularity || 0);
    }
  });
}

export function createDefaultFilters() {
  return {
    year: "all",
    minRating: "all",
    language: "all",
    provider: "all",
    genres: [],
    sortBy: "popularity.desc",
  };
}
