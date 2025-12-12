import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ query, setQuery, handleSearch }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <nav
      className="
      backdrop-blur-md bg-white/30 dark:bg-gray-900/30
      border-b border-gray-300/30 dark:border-gray-700/30
      sticky top-0 z-50
      px-6 py-4 flex items-center justify-between gap-6
    "
    >
      {/* Logo */}
      <Link to="/">
        <h1
          className="
          text-3xl font-extrabold tracking-wide 
          text-blue-600 dark:text-blue-400 cursor-pointer
        "
        >
          🎬 Movie Finder
        </h1>
      </Link>

      {/* Navigation Links */}
      <div
        className="
        hidden md:flex gap-6 text-lg font-medium
      "
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
            } hover:text-blue-600 dark:hover:text-blue-400`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/trending"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
            } hover:text-blue-600 dark:hover:text-blue-400`
          }
        >
          Trending
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
            } hover:text-blue-600 dark:hover:text-blue-400`
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `transition ${
              isActive ? "text-pink-600 dark:text-pink-400" : "text-gray-700 dark:text-gray-300"
            } hover:text-pink-600 dark:hover:text-pink-400`
          }
        >
          ❤️ Favorites
        </NavLink>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-40 sm:w-56 md:w-72 lg:w-80
            p-2 pl-3 rounded-l-xl 
            outline-none border
            bg-white/90 dark:bg-gray-800/80
            border-gray-300 dark:border-gray-700
            text-black dark:text-white
            focus:ring-2 focus:ring-blue-500
          "
        />
        <button
          type="submit"
          className="
            bg-blue-600 dark:bg-blue-500
            hover:bg-blue-700 dark:hover:bg-blue-600
            px-4 py-2 rounded-r-xl text-white font-medium
            transition-all
          "
        >
          Search
        </button>
      </form>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="
          ml-2 px-3 py-2 rounded-xl font-medium
          bg-gray-300 dark:bg-gray-700
          hover:bg-gray-400 dark:hover:bg-gray-600
          transition
        "
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </button>
    </nav>
  );
}
