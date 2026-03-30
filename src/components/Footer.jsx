export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 py-6 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8 dark:text-gray-400">
        <p className="font-semibold text-gray-900 dark:text-white">Movie Finder</p>
        <p>Search movies, browse trending titles, and keep your favorites in one place.</p>
        <p>© {new Date().getFullYear()} Movie Finder</p>
      </div>
    </footer>
  );
}
