import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Film } from "lucide-react";
import MovieCard from "../components/MovieCard";
import VideoPlayer from "../components/VideoPlayer";
import LoadingSpinner from "../components/LoadingSpinner";
import { api } from "../services/api";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchMovies();
    }
  }, [query]);

  const searchMovies = async () => {
    setLoading(true);
    const data = await api.searchMovies(query, 20);
    setMovies(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Résultats pour "{query}"
          </h2>
          <p className="text-gray-400">
            {loading
              ? "Recherche en cours..."
              : `${movies.length} résultat(s) trouvé(s)`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Recherche en cours..." />
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="mx-auto text-gray-600 mb-4" size={80} />
            <p className="text-gray-400 text-xl font-semibold mb-2">
              Aucun résultat trouvé
            </p>
            <p className="text-gray-500 text-sm">
              Essayez avec d'autres mots-clés
            </p>
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

export default Search;
