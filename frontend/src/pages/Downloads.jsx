import React, { useState, useEffect } from "react";
import { Download, Trash2, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import VideoPlayer from "../components/VideoPlayer";
import { useAuth } from "../context/AuthContext";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadDownloads();
  }, [isAuthenticated]);

  const loadDownloads = () => {
    const offlineMovies = JSON.parse(
      localStorage.getItem("offlineMovies") || "[]"
    );
    setDownloads(offlineMovies);
  };

  const handleDelete = (movieId) => {
    if (window.confirm("Supprimer ce téléchargement ?")) {
      const offlineMovies = JSON.parse(
        localStorage.getItem("offlineMovies") || "[]"
      );
      const updated = offlineMovies.filter((m) => m._id !== movieId);
      localStorage.setItem("offlineMovies", JSON.stringify(updated));
      loadDownloads();
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Supprimer tous les téléchargements ?")) {
      localStorage.removeItem("offlineMovies");
      setDownloads([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Download className="text-blue-500" size={32} />
              <h2 className="text-3xl font-bold text-white">
                Mes Téléchargements
              </h2>
            </div>
            <p className="text-gray-400">
              {downloads.length} film(s) téléchargé(s)
            </p>
          </div>

          {downloads.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Trash2 size={20} />
              Tout supprimer
            </button>
          )}
        </div>

        {/* Content */}
        {downloads.length === 0 ? (
          <div className="text-center py-20">
            <Download className="mx-auto text-gray-600 mb-4" size={80} />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              Aucun téléchargement
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Téléchargez des films pour les regarder hors ligne
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Découvrir des films
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {downloads.map((movie) => (
              <div key={movie._id} className="relative">
                <MovieCard movie={movie} onClick={setSelectedMovie} />
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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

export default Downloads;
