import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Category from "./pages/Category";
import Movie from "./pages/Movie";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Downloads from "./pages/Downloads";
import InstallPWA from "./components/InstallPWA";
import OfflineIndicator from "./components/OfflineIndicator";
import AdBanner from "./components/AdBanner";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { Film } from "lucide-react";
import { api } from "./services/api";

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();

      // Adaptation robuste
      let categoriesList = [];
      if (Array.isArray(data)) {
        categoriesList = data;
      } else if (data && data.genres && Array.isArray(data.genres)) {
        categoriesList = data.genres;
      } else if (data && typeof data === "object") {
        // Fallback: si l'objet contient des clés qui sont des tableaux
        const possibleArrays = Object.values(data).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          categoriesList = possibleArrays[0];
        }
      }

      setCategories(categoriesList);
    } catch (err) {
      console.error("Error in fetchCategories:", err);
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <AnalyticsTracker />
            <div className="min-h-screen bg-gray-900 dark:bg-gray-900 light:bg-white flex flex-col">
              {/* Header Ad */}
              <div className="bg-black py-2">
                <AdBanner
                  slot="HEADER_SLOT"
                  format="horizontal"
                  className="max-w-7xl mx-auto px-4"
                  style={{ minHeight: "90px" }}
                />
              </div>

              {/* Header */}
              <Header categories={categories} />

              {/* PWA Components */}
              <InstallPWA />
              <OfflineIndicator />

              {/* Routes */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/category/:genre" element={<Category />} />
                <Route path="/movie/:id" element={<Movie />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/history" element={<History />} />
                <Route path="/downloads" element={<Downloads />} />
              </Routes>

              {/* Footer */}
              <footer className="bg-black border-t border-gray-800 dark:border-gray-800 light:border-gray-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  {/* Footer Ad */}
                  <div className="mb-8">
                    <AdBanner
                      slot="FOOTER_SLOT"
                      format="horizontal"
                      style={{ minHeight: "90px" }}
                    />
                  </div>

                  <div className="text-center text-gray-400 dark:text-gray-400 light:text-gray-600">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Film className="text-red-600" size={24} />
                      <span className="text-xl font-bold text-white dark:text-white light:text-gray-900">
                        NetWood
                      </span>
                    </div>
                    <p className="mb-2">
                      © 2024 NetWood - Plateforme de streaming de films
                      nigérians
                    </p>
                    <p className="text-sm">Propulsé par l'API YouTube</p>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
