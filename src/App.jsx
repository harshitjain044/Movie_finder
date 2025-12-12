import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { ThemeContext } from "./context/ThemeContext";
import Trending from "./pages/Trending";
import Categories from "./pages/Categories";


export default function App() {
  const [query, setQuery] = useState("");
  const [handleSearch, setHandleSearch] = useState(() => () => {});
  const { theme } = useContext(ThemeContext); // 👈 yaha context se theme lo

  return (
    <Router>
      {/* Theme ke hisaab se root div ke classes */}
      <div
        className={`flex flex-col min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }`}
      >
        <Navbar query={query} setQuery={setQuery} handleSearch={handleSearch} />

        <main className="flex-1 p-4">
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
             <Route path="/favorites" element={<Favorites />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/categories" element={<Categories />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
