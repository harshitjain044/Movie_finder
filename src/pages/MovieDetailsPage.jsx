import { useNavigate, useParams } from "react-router-dom";
import MovieDetailsContent from "../components/MovieDetailsContent";
import PageSearchHeader from "../components/PageSearchHeader";

export default function MovieDetailsPage({ query, setQuery, handleSearch }) {
  const navigate = useNavigate();
  const { movieId } = useParams();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageSearchHeader
        title="Movie Details"
        description="Search for another title anytime without leaving the details page."
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
      >
        Back
      </button>

      <div className="rounded-[2rem] border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70 sm:p-8">
        <MovieDetailsContent movieId={movieId} />
      </div>
    </section>
  );
}
