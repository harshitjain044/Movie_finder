export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-center py-4 mt-6">
      <p className="text-gray-600 dark:text-gray-400">
        🎬 Movie Finder © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
