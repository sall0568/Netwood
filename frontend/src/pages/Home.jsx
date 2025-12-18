import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import MovieCard from "../components/MovieCard";
import AdBanner from "../components/AdBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

// Map UI language to content language
const languageMap = {
  fr: "French",
  en: "English",
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const { t, language } = useLanguage();

  // Get content language from UI language
  const contentLanguage = languageMap[language] || "English";

  useEffect(() => {
    fetchTrendingMovies();
    if (isAuthenticated) {
      fetchRecommendations();
    }
  }, [isAuthenticated, language]); // Re-fetch when language changes

  const fetchTrendingMovies = async () => {
    setLoading(true);
    const data = await api.getTrendingMovies(20, contentLanguage);
    setMovies(data);
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    const data = await api.getRecommendations(token, 12);
    setRecommendations(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 light:bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Recommandations Section */}
        {isAuthenticated && recommendations.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">
                ✨ {t("home.recommended")}
              </h2>
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                {t("home.recommendedDesc")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendations.map((movie) => (
                <MovieCard
                  key={movie._id || movie.videoId}
                  movie={movie}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ad Banner - In-feed */}
        <div className="mb-12">
          <AdBanner 
            slot="HOME_FEED_SLOT" 
            format="horizontal" 
            className="w-full max-w-4xl mx-auto"
          />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-2">
            🔥 {t("home.trending")}
          </h2>
          <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
            {t("home.trendingDesc")}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message={t("common.loading")} />
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="mx-auto text-gray-600 mb-4" size={80} />
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xl font-semibold mb-2">
              {t("home.noMovies")}
            </p>
            <p className="text-gray-500 dark:text-gray-500 light:text-gray-500 text-sm">
              {t("home.noMoviesDesc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id || movie.videoId}
                movie={movie}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
