import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieWatchProviders } from "../services/api";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "https://via.placeholder.com/500x750?text=No+Image";

export default function MovieCard({ movie, onQuickView, watchInfo: initialWatchInfo }) {
  const [watchInfo, setWatchInfo] = useState(initialWatchInfo || null);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA";

  useEffect(() => {
    if (initialWatchInfo) {
      setWatchInfo(initialWatchInfo);
      return;
    }

    let active = true;

    const loadWatchInfo = async () => {
      try {
        const data = await fetchMovieWatchProviders(movie.id);
        if (active) {
          setWatchInfo(data);
        }
      } catch {
        if (active) {
          setWatchInfo(null);
        }
      }
    };

    loadWatchInfo();

    return () => {
      active = false;
    };
  }, [initialWatchInfo, movie.id]);

  const primaryProvider = watchInfo?.providers?.[0]?.provider_name;

  return (
    <article className="group overflow-hidden rounded-2xl bg-gray-900 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link
        to={`/movie/${movie.id}`}
        className="relative block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
      >
        <img
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : FALLBACK_POSTER}
          alt={movie.title}
          className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute right-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-black shadow-md">
          {movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : "N/A"}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="line-clamp-2 text-base font-bold sm:text-lg">{movie.title}</p>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-white/80 sm:text-sm">
            <span>{releaseYear}</span>
            <span>{movie.original_language?.toUpperCase() || "N/A"}</span>
          </div>

          <div className="mt-3 text-[11px] font-medium text-white/80">
            {primaryProvider ? (
              <span>
                Available in {watchInfo.region}: {watchInfo.type}
              </span>
            ) : (
              <span>Availability info coming soon</span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black px-4 py-3">
        <Link
          to={`/movie/${movie.id}`}
          className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
        >
          Full details
        </Link>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(movie)}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 transition hover:bg-gray-200"
          >
            Quick view
          </button>
        )}
      </div>
    </article>
  );
}
