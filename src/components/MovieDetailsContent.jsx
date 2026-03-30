import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";
import { fetchMovieDetails, fetchMovieWatchProviders } from "../services/api";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w185";
const FALLBACK_POSTER = "https://via.placeholder.com/500x750?text=No+Image";

export default function MovieDetailsContent({ movieId, initialMovie, compact = false }) {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [details, setDetails] = useState(null);
  const [watchInfo, setWatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movieId) {
      return;
    }

    let active = true;

    const loadDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const [detailsResponse, watchProviderResponse] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchMovieWatchProviders(movieId),
        ]);

        if (!active) {
          return;
        }

        setDetails(detailsResponse);
        setWatchInfo(watchProviderResponse);
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load movie details.");
          setDetails(null);
          setWatchInfo(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      active = false;
    };
  }, [movieId]);

  const movie = details || initialMovie;
  const isFavorite = favorites.some((item) => item.id === Number(movieId));

  const certification = useMemo(() => {
    const results = details?.release_dates?.results || [];
    const usRelease = results.find((entry) => entry.iso_3166_1 === "US");
    const regionalRelease = usRelease || results[0];
    return regionalRelease?.release_dates?.find((entry) => entry.certification)?.certification || "Not rated";
  }, [details]);

  const trailer = useMemo(() => {
    const videos = details?.videos?.results || [];
    return (
      videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
      videos.find((video) => video.site === "YouTube")
    );
  }, [details]);

  const cast = useMemo(() => (details?.credits?.cast || []).slice(0, compact ? 6 : 8), [compact, details]);
  const reviews = useMemo(() => (details?.reviews?.results || []).slice(0, 3), [details]);
  const similarMovies = useMemo(() => (details?.similar?.results || []).slice(0, compact ? 4 : 6), [compact, details]);

  if (loading && !movie) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Loading movie details...
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
      <div className="bg-gray-100 p-4 dark:bg-gray-900 md:p-6">
        <img
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : FALLBACK_POSTER}
          alt={movie.title}
          className="mx-auto aspect-[2/3] w-full max-w-xs rounded-2xl object-cover shadow-xl"
        />
      </div>

      <div className="p-1 sm:p-2">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Movie Details
            </p>
            <h1 className="text-3xl font-black sm:text-4xl">{movie.title}</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {movie.release_date || "Release date unavailable"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => (isFavorite ? removeFavorite(movie.id) : addFavorite(movie))}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isFavorite
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(movie.genres || []).map((genre) => (
            <span
              key={genre.id}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="text-sm leading-7 text-gray-700 dark:text-gray-300 sm:text-base">
          {movie.overview || "No description is available for this movie yet."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Rating" value={movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : "N/A"} />
          <InfoCard label="Runtime" value={movie.runtime ? `${movie.runtime} min` : "N/A"} />
          <InfoCard label="Certification" value={certification} />
          <InfoCard label="Language" value={movie.original_language?.toUpperCase() || "N/A"} />
          <InfoCard label="Popularity" value={movie.popularity ? Math.round(movie.popularity).toString() : "N/A"} />
          <InfoCard label="Votes" value={movie.vote_count?.toString() || "N/A"} />
          <InfoCard
            label="Countries"
            value={
              movie.production_countries?.length
                ? movie.production_countries.map((country) => country.name).join(", ")
                : "N/A"
            }
          />
          <InfoCard
            label="Available On"
            value={
              watchInfo?.providers?.length
                ? `${watchInfo.type}: ${watchInfo.providers
                    .slice(0, 2)
                    .map((provider) => provider.provider_name)
                    .join(", ")}`
                : "Not available"
            }
          />
        </div>

        {watchInfo?.link && (
          <a
            href={watchInfo.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            View Watch Options
          </a>
        )}

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Trailer</h2>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Open on YouTube
                </a>
              )}
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {loading ? (
                <div className="flex aspect-video items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Loading trailer...
                </div>
              ) : trailer ? (
                <iframe
                  title={`${movie.title} trailer`}
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No trailer is available for this movie right now.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Top Cast</h2>
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: compact ? 4 : 6 }).map((_, index) => (
                  <div key={index} className="skeleton aspect-[3/4] rounded-2xl" />
                ))}
              </div>
            ) : cast.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {cast.map((person) => (
                  <div
                    key={person.cast_id ?? person.credit_id ?? person.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <img
                      src={
                        person.profile_path
                          ? `${PROFILE_BASE_URL}${person.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Photo"
                      }
                      alt={person.name}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {person.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                        {person.character || "Cast member"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Cast information is not available for this title.
              </div>
            )}
          </section>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Reviews</h2>
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.author}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="line-clamp-6 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {review.content}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No reviews are available for this movie yet.
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Similar Movies</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: compact ? 4 : 6 }).map((_, index) => (
                <div key={index} className="skeleton aspect-[2/3] rounded-2xl" />
              ))}
            </div>
          ) : similarMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {similarMovies.map((similarMovie) => (
                <Link
                  key={similarMovie.id}
                  to={`/movie/${similarMovie.id}`}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <img
                    src={
                      similarMovie.poster_path
                        ? `${IMAGE_BASE_URL}${similarMovie.poster_path}`
                        : FALLBACK_POSTER
                    }
                    alt={similarMovie.title}
                    className="aspect-[2/3] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {similarMovie.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Similar titles are not available for this movie right now.
            </div>
          )}
        </section>

        {error && movie && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
