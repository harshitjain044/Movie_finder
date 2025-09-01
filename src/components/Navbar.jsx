import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar({ query, setQuery, handleSearch }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <nav className="px-6 py-4 shadow-lg sticky top-0 z-50 flex items-center justify-between gap-4 bg-gray-200 dark:bg-gray-800">
      {/* name */}
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        🎬 Movie Finder
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-50 p-2 rounded-l-lg bg-white text-black dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="ml-4 px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
      >
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  );
}
