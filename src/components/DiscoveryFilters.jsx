import { useMemo, useState } from "react";

export default function DiscoveryFilters({ filters, setFilters, options }) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.year !== "all") count += 1;
    if (filters.minRating !== "all") count += 1;
    if (filters.language !== "all") count += 1;
    if (filters.provider !== "all") count += 1;
    if (filters.sortBy !== "popularity.desc") count += 1;
    count += filters.genres.length;

    return count;
  }, [filters]);

  const toggleGenre = (genreId) => {
    setFilters((current) => ({
      ...current,
      genres: current.genres.includes(genreId)
        ? current.genres.filter((id) => id !== genreId)
        : [...current.genres, genreId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: "all",
      minRating: "all",
      language: "all",
      provider: "all",
      genres: [],
      sortBy: "popularity.desc",
    });
  };

  return (
    <section className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Discovery Tools</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Open filters only when you need them.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {activeFilterCount} active
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {isOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 rounded-[2rem] border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Filter Results</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Narrow results by year, rating, language, genre mix, and platform.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="w-fit rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <FilterSelect
              label="Sort by"
              value={filters.sortBy}
              onChange={(value) => setFilters((current) => ({ ...current, sortBy: value }))}
              options={[
                { value: "popularity.desc", label: "Popularity: High to Low" },
                { value: "popularity.asc", label: "Popularity: Low to High" },
                { value: "rating.desc", label: "Rating: High to Low" },
                { value: "release.desc", label: "Newest First" },
                { value: "release.asc", label: "Oldest First" },
                { value: "title.asc", label: "Title: A to Z" },
              ]}
            />

            <FilterSelect
              label="Release year"
              value={filters.year}
              onChange={(value) => setFilters((current) => ({ ...current, year: value }))}
              options={[
                { value: "all", label: "All years" },
                ...options.years.map((year) => ({ value: year, label: year })),
              ]}
            />

            <FilterSelect
              label="Minimum rating"
              value={filters.minRating}
              onChange={(value) => setFilters((current) => ({ ...current, minRating: value }))}
              options={[
                { value: "all", label: "Any rating" },
                { value: "8", label: "8+" },
                { value: "7", label: "7+" },
                { value: "6", label: "6+" },
                { value: "5", label: "5+" },
              ]}
            />

            <FilterSelect
              label="Language"
              value={filters.language}
              onChange={(value) => setFilters((current) => ({ ...current, language: value }))}
              options={[
                { value: "all", label: "All languages" },
                ...options.languages.map((language) => ({ value: language, label: language })),
              ]}
            />

            <FilterSelect
              label="Platform"
              value={filters.provider}
              onChange={(value) => setFilters((current) => ({ ...current, provider: value }))}
              options={[
                { value: "all", label: "All platforms" },
                ...options.providers.map((provider) => ({ value: provider, label: provider })),
              ]}
            />
          </div>

          {options.genres.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Genre combinations
              </p>
              <div className="flex flex-wrap gap-2">
                {options.genres.map((genre) => {
                  const isActive = filters.genres.includes(genre.id);

                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => toggleGenre(genre.id)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                      }`}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
