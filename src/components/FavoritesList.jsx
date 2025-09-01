export default function FavoritesList({ favorites }) {
  if (favorites.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        ⭐ Favorites
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="w-32 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${fav.poster_path}`}
              alt={fav.title}
              className="rounded-lg"
            />
            <p className="text-sm mt-1 text-center text-gray-900 dark:text-gray-300">
              {fav.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
