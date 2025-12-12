import { useContext, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
// import FavoritesList from "../components/FavoritesList";
import MovieModal from "../components/MovieModal";

export default function FavoritesList({ favorites, onRemove, onMovieClick }) {
  if (!Array.isArray(favorites) || favorites.length === 0)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg">
        No favorites added yet ❤️
      </p>
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        ⭐ Your Favorites
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            onClick={() => onMovieClick(fav)} // ⭐ FIXED — opens modal
            className="
              relative min-w-[160px] 
              bg-gray-900 dark:bg-gray-800 
              rounded-xl shadow-md overflow-hidden 
              group cursor-pointer
            "
          >
            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w300${fav.poster_path}`}
              alt={fav.title}
              className="
                w-full h-48 object-cover 
                group-hover:scale-110 
                transition-transform duration-300
              "
            />

            {/* Hover overlay */}
            <div
              className="
                absolute inset-0 bg-black/40 opacity-0 
                group-hover:opacity-100 
                transition-opacity duration-300
              "
            ></div>

            {/* Title */}
            <p
              className="
                absolute bottom-2 left-1/2 -translate-x-1/2 
                text-white text-sm font-medium opacity-0 
                group-hover:opacity-100 
                transition-all duration-300 text-center
              "
            >
              {fav.title}
            </p>

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();    // ❗ Prevent opening modal
                onRemove(fav.id);
              }}
              className="
                absolute top-2 right-2 
                bg-red-500 hover:bg-red-600 
                text-white text-xs px-2 py-1 rounded 
                opacity-80 hover:opacity-100 transition
              "
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
