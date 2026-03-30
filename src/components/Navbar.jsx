import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/trending", label: "Trending" },
  { to: "/categories", label: "Categories" },
  { to: "/favorites", label: "Favorites" },
];

function navLinkClasses(isActive) {
  return `rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-gray-700 hover:bg-white/70 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400"
  }`;
}

export default function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="min-w-0"
          >
            <p className="truncate text-xl font-black tracking-tight text-blue-600 dark:text-blue-400 sm:text-2xl">
              Movie Finder
            </p>
            <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
              Search, save, and explore with ease
            </p>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:text-blue-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:text-blue-300"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              Menu
            </button>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-end">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>

        {menuOpen && (
          <div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950/90 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => navLinkClasses(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
