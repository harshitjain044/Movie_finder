import { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeContext } from "./context/ThemeContext";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import Trending from "./pages/Trending";

export default function App() {
  const [query, setQuery] = useState("");
  const [handleSearch, setHandleSearch] = useState(() => () => {});
  const { theme } = useContext(ThemeContext);

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-950 text-white"
            : "bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_50%,_#eff6ff)] text-gray-950"
        }`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    query={query}
                    setQuery={setQuery}
                    setHandleSearch={setHandleSearch}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <Favorites
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                  />
                }
              />
              <Route
                path="/trending"
                element={
                  <Trending
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                  />
                }
              />
              <Route
                path="/categories"
                element={
                  <Categories
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                  />
                }
              />
              <Route
                path="/movie/:movieId"
                element={
                  <MovieDetailsPage
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                  />
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}
