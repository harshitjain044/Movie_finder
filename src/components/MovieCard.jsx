export default function MovieCard({ movie, onClick }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
      onClick={() => onClick(movie)}
    >
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        className="w-full h-80 object-cover"
      />
      <div className="p-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {movie.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
}