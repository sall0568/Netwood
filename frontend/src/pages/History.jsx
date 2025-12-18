import React, { useState, useEffect } from "react";
import { Clock, Trash2, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import VideoPlayer from "../components/VideoPlayer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    setLoading(true);
    const data = await api.getHistory(token, 50);
    setHistory(data);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir effacer tout votre historique ?")
    ) {
      const result = await api.clearHistory(token);
      if (result.success) {
        setHistory([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-blue-500" size={32} />
              <h2 className="text-3xl font-bold text-white">Mon Historique</h2>
            </div>
            <p className="text-gray-400">
              {loading
                ? "Chargement..."
                : `${history.length} film(s) dans votre historique`}
            </p>
          </div>

          {history.length > 0 && !loading && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Trash2 size={20} />
              Tout effacer
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Chargement de votre historique..." />
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="mx-auto text-gray-600 mb-4" size={80} />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              Aucun historique pour le moment
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Les films que vous regardez apparaîtront ici
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
            {history.map((item) => (
              <div key={item._id} className="relative">
                <MovieCard movie={item.contentId} onClick={setSelectedMovie} />
                {/* Barre de progression */}
                {item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
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

export default History;
