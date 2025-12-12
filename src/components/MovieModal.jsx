import { createPortal } from "react-dom";
import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";


export default function MovieModal({ movie, isOpen, onClose }) {
  if (!isOpen || !movie) return null;

  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const isFav = favorites.some((m) => m.id === movie.id);


  return createPortal(
    <div
      className="
        fixed inset-0 bg-black/70 backdrop-blur-sm
        flex items-center justify-center
        z-50 p-4
        animate-fadeIn
      "
    >
      <div
        className="
          bg-white dark:bg-gray-900 
          text-gray-900 dark:text-white 
          rounded-2xl shadow-2xl 
          w-full max-w-4xl 
          overflow-hidden 
          animate-scaleUp
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 
            text-gray-700 dark:text-gray-300 
            hover:text-red-500 
            text-2xl transition
          "
        >
          ✖
        </button>

        {/* Modal Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          {/* Poster Section */}
          <div className="flex justify-center items-start">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              className="
                rounded-xl shadow-lg 
                w-full max-w-xs 
                object-cover
              "
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4">

            {/* Title */}
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <button
              onClick={() => (isFav ? removeFavorite(movie.id) : addFavorite(movie))}
              className="bg-blue-600 hover:bg-blue-700 
                        px-4 py-2 rounded-lg text-white 
                        font-medium transition"
            >
              {isFav ? "💔 Remove from Favorites" : "❤️ Add to Favorites"}
            </button>


            {/* Overview */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {movie.overview || "No description available."}
            </p>

            {/* Movie Info */}
            <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <p>
                <span className="font-semibold">Release Date:</span>{" "}
                {movie.release_date || "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Rating:</span>{" "}
                ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Popularity:</span>{" "}
                {movie.popularity || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Vote Count:</span>{" "}
                {movie.vote_count || "N/A"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
