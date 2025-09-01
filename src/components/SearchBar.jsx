export default function SearchBar({ query, setQuery, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-1/2 p-2 rounded-l-lg 
                   bg-white text-black 
                   dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
