import { createPortal } from "react-dom";

export default function MovieModal({ movie, isOpen, onClose }) {
  if (!isOpen || !movie) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative text-gray-900 dark:text-white">

        {/* Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        {/* Content */}
        <div className="p-6 flex  gap-2 ">
          {/* Poster */}
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="rounded mb-4 mx-auto max-h-96 object-contain"
          />
          <div className="flex flex-col gap-6">

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3  text-center">{movie.title}</h2>

          {/* Overview */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {movie.overview ? movie.overview : "No description available."}
          </p>

          {/* Extra Info */}
          <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-semibold">Release Date:</span>{" "}
              {movie.release_date || "Unknown"}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
