import FavoritesList from "../components/FavoritesList";

export default function Favorites({ favorites, setFavorites }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Favorites ❤️</h2>
      <FavoritesList
        favorites={favorites}
        onRemove={(id) => setFavorites(favorites.filter((m) => m.id !== id))}
      />
    </div>
  );
}
