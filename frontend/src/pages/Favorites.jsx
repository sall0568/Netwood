import React, { useState, useEffect } from "react";
import { Heart, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import VideoPlayer from "../components/VideoPlayer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    setLoading(true);
    const data = await api.getFavorites(token, 50);
    setFavorites(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-red-600 fill-red-600" size={32} />
            <h2 className="text-3xl font-bold text-white">Mes Favoris</h2>
          </div>
          <p className="text-gray-400">
            {loading
              ? "Chargement..."
              : `${favorites.length} film(s) dans vos favoris`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Chargement de vos favoris..." />
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto text-gray-600 mb-4" size={80} />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              Aucun favori pour le moment
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Ajoutez des films à vos favoris pour les retrouver facilement
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
            >
              Découvrir des films
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
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

export default Favorites;
