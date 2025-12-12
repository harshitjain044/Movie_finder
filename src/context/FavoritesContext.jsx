import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on startup
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  // Save to localStorage whenever favorites changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Add to favorites
  const addFavorite = (movie) => {
    if (!favorites.some((m) => m.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  // Remove from favorites
  const removeFavorite = (id) => {
    setFavorites(favorites.filter((m) => m.id !== id));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
