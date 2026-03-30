const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const watchProviderCache = new Map();

async function request(endpoint) {
  if (!API_KEY) {
    throw new Error("Missing TMDB API key. Add VITE_TMDB_API_KEY to your environment.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.status_message || "Something went wrong while contacting TMDB.");
  }

  return data;
}

export async function fetchTrendingMovies() {
  const data = await request(`/trending/movie/week?api_key=${API_KEY}`);
  return data.results || [];
}

export async function searchMovies(query) {
  const data = await request(
    `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return data.results || [];
}

export async function fetchSearchSuggestions(query) {
  const results = await searchMovies(query);
  return results.slice(0, 6);
}

export async function fetchGenres() {
  const data = await request(`/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  return data.genres || [];
}

export async function fetchMoviesByGenre(genreId) {
  const data = await request(
    `/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
  );
  return data.results || [];
}

export async function fetchMovieDetails(movieId) {
  return request(
    `/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,release_dates,reviews,recommendations,similar`
  );
}

function getUserRegion() {
  const locale =
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : "en-US";

  const region = locale.split("-")[1]?.toUpperCase();
  return region || "US";
}

export async function fetchMovieWatchProviders(movieId) {
  const region = getUserRegion();
  const cacheKey = `${movieId}-${region}`;

  if (watchProviderCache.has(cacheKey)) {
    return watchProviderCache.get(cacheKey);
  }

  const data = await request(`/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
  const regionalData = data.results?.[region] || data.results?.US || null;
  const flatrateProviders = regionalData?.flatrate || [];
  const rentProviders = regionalData?.rent || [];
  const buyProviders = regionalData?.buy || [];

  const result = {
    region: regionalData ? region : data.results?.US ? "US" : null,
    link: regionalData?.link || data.results?.US?.link || "",
    providers:
      flatrateProviders.length > 0
        ? flatrateProviders
        : rentProviders.length > 0
          ? rentProviders
          : buyProviders,
    type:
      flatrateProviders.length > 0
        ? "Stream"
        : rentProviders.length > 0
          ? "Rent"
          : buyProviders.length > 0
            ? "Buy"
            : null,
  };

  watchProviderCache.set(cacheKey, result);
  return result;
}
