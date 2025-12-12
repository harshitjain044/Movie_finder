export default function MovieCard({ movie, onClick }) {
  return (
    <div
      className="
        relative cursor-pointer group 
        rounded-xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-300
        bg-gray-900
      "
      onClick={() => onClick(movie)}
    >
      {/* Movie Poster */}
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        className="
          w-full h-80 object-cover 
          group-hover:scale-110 
          transition-transform duration-500 ease-in-out
        "
      />

      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-t from-black/80 via-black/20 to-transparent
          opacity-80 group-hover:opacity-100 
          transition-opacity duration-300
        "
      ></div>

      {/* Rating Badge */}
      <div
        className="
          absolute top-3 right-3 
          bg-yellow-500 text-black font-bold 
          text-sm px-2 py-1 rounded-lg
          shadow-md
        "
      >
        ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
      </div>

      {/* Title Overlay */}
      <div
        className="
          absolute bottom-0 left-0 w-full 
          p-3
          text-white font-semibold 
          text-center text-lg
          opacity-0 group-hover:opacity-100
          translate-y-3 group-hover:translate-y-0
          transition-all duration-300
        "
      >
        {movie.title}
      </div>
    </div>
  );
}
