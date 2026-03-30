import { useEffect } from "react";
import { createPortal } from "react-dom";
import MovieDetailsContent from "./MovieDetailsContent";

export default function MovieModal({ movie, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="relative w-full max-w-7xl overflow-hidden rounded-[2rem] bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-950 dark:text-white sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Close
          </button>

          <div className="max-h-[88vh] overflow-y-auto pr-1">
            <MovieDetailsContent
              movieId={movie.id}
              initialMovie={movie}
              compact
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
