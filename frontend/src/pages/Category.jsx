import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Film } from "lucide-react";
import MovieCard from "../components/MovieCard";
import VideoPlayer from "../components/VideoPlayer";
import LoadingSpinner from "../components/LoadingSpinner";
import { api } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

// Map UI language to content language
const languageMap = {
  fr: "French",
  en: "English",
};

const Category = () => {
  const { genre } = useParams();
  const { language } = useLanguage();

  // Get content language from UI language
  const contentLanguage = languageMap[language] || "English";

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genre) {
      fetchMoviesByCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre, language]);

  const fetchMoviesByCategory = async () => {
    setLoading(true);
    const data = await api.getMoviesByCategory("genre", genre, 20, contentLanguage);
    setMovies(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 capitalize">
            Genre: {genre}
          </h2>
          <p className="text-gray-400">
            {loading
              ? "Chargement..."
              : `${movies.length} film(s) disponible(s)`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Chargement des films..." />
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="mx-auto text-gray-600 mb-4" size={80} />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              Aucun film dans cette catégorie
            </p>
            <p className="text-gray-500 text-sm">Essayez une autre catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id || movie.videoId}
                movie={movie}
                onClick={setSelectedMovie}
              />
            ))}
          </div>
        )}
      </main>

      {/* Video Player Modal */}
      {selectedMovie && (
        <VideoPlayer
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Category;
