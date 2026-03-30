import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchSuggestions } from "../services/api";

export default function PageSearchHeader({
  title,
  description,
  query,
  setQuery,
  handleSearch,
  rightContent = null,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      setLoadingSuggestions(false);
      return undefined;
    }

    let active = true;
    setLoadingSuggestions(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(trimmedQuery);

        if (!active) {
          return;
        }

        setSuggestions(results);
        setSuggestionsOpen(true);
      } catch {
        if (active) {
          setSuggestions([]);
          setSuggestionsOpen(false);
        }
      } finally {
        if (active) {
          setLoadingSuggestions(false);
        }
      }
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchContainerRef.current?.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const runSearch = (searchTerm) => {
    setQuery(searchTerm);
    setSuggestionsOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        handleSearch?.({ preventDefault() {} }, searchTerm);
      }, 0);
      return;
    }

    handleSearch?.({ preventDefault() {} }, searchTerm);
  };

  const submitSearch = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      navigate("/");
      setSuggestionsOpen(false);
      return;
    }

    runSearch(query.trim());
  };

  return (
    <section className="mb-8 rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-700 p-5 text-white shadow-2xl sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-slate-200 sm:text-base">{description}</p>
          )}
        </div>

        {rightContent && <div className="flex flex-wrap gap-3">{rightContent}</div>}
      </div>

      <form onSubmit={submitSearch} className="mt-5">
        <div ref={searchContainerRef} className="relative">
          <div className="flex overflow-hidden rounded-2xl border border-white/15 bg-white/95 shadow-lg">
            <input
              type="search"
              placeholder="Search for movies on any page..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setSuggestionsOpen(true);
                }
              }}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              aria-label="Search movies"
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {(suggestionsOpen || loadingSuggestions) && query.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {loadingSuggestions ? (
                <p className="px-4 py-3 text-sm text-gray-500">Loading suggestions...</p>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((movie) => (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => runSearch(movie.title)}
                      className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-blue-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{movie.title}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "Release date unknown"}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-blue-600">View</span>
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="w-full bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Search for "{query.trim()}"
                  </button>
                </>
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">
                  No suggestions found. Press search to see full results.
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
