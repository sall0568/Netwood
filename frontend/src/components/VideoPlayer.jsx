import React, { useEffect } from "react";
import { X, Film, Tv, Calendar, Globe, Eye, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RatingStars from "./RatingStars";
import DownloadButton from "./DownloadButton";
import ShareButton from "./ShareButton";
import { api } from "../services/api";

const VideoPlayer = ({ movie, onClose }) => {
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Ajouter à l'historique quand on ouvre le player
    if (isAuthenticated && movie && movie._id) {
      api.addToHistory(token, movie._id, 0);
    }
  }, [movie, isAuthenticated, token]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-auto">
      <div className="max-w-6xl mx-auto p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition"
        >
          <X size={20} />
          Fermer
        </button>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${movie.videoId}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={movie.title}
          />
        </div>

        {/* Movie Details */}
        <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">{movie.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <span className="flex items-center gap-2 text-gray-300">
              {movie.contentType === "movie" ? (
                <Film size={16} />
              ) : (
                <Tv size={16} />
              )}
              <span className="capitalize font-medium">
                {movie.contentType}
              </span>
            </span>

            {movie.releaseYear && (
              <span className="flex items-center gap-2 text-gray-300">
                <Calendar size={16} />
                {movie.releaseYear}
              </span>
            )}

            {movie.language && (
              <span className="flex items-center gap-2 text-gray-300">
                <Globe size={16} />
                {movie.language}
              </span>
            )}

            <span className="flex items-center gap-2 text-gray-300">
              <Eye size={16} />
              {api.formatNumber(movie.viewCount)} vues
            </span>

            {movie.likeCount > 0 && (
              <span className="flex items-center gap-2 text-gray-300">
                <Star size={16} className="fill-yellow-500 text-yellow-500" />
                {api.formatNumber(movie.likeCount)}
              </span>
            )}
          </div>

          {/* Genres */}
          {movie.genre && movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g, idx) => (
                <span
                  key={idx}
                  className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm capitalize font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Rating Section */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white text-lg mb-3">
              Votre note
            </h3>
            <RatingStars contentId={movie._id} size={32} showLabel={true} />
          </div>

          {/* Download Section */}
          {isAuthenticated && (
            <div className="mb-6 flex gap-3">
              <DownloadButton movie={movie} />
              <ShareButton movie={movie} />
            </div>
          )}

          {!isAuthenticated && (
            <div className="mb-6">
              <ShareButton movie={movie} />
            </div>
          )}

          {/* Details Section */}
          <div className="border-t border-gray-800 pt-6">
            {/* Description */}
            <div className="text-gray-300 mb-6">
              <h3 className="font-semibold text-white text-lg mb-3">
                Description
              </h3>
              <p className="text-sm leading-relaxed">{movie.description}</p>
            </div>

            {/* Additional Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {movie.cast && movie.cast.length > 0 && (
                <div className="text-gray-300">
                  <h3 className="font-semibold text-white mb-2">
                    Distribution
                  </h3>
                  <p className="text-sm">{movie.cast.slice(0, 5).join(", ")}</p>
                </div>
              )}

              {movie.director && (
                <div className="text-gray-300">
                  <h3 className="font-semibold text-white mb-2">Réalisateur</h3>
                  <p className="text-sm">{movie.director}</p>
                </div>
              )}

              {movie.productionCompany && (
                <div className="text-gray-300">
                  <h3 className="font-semibold text-white mb-2">Production</h3>
                  <p className="text-sm">{movie.productionCompany}</p>
                </div>
              )}

              {movie.channelTitle && (
                <div className="text-gray-300">
                  <h3 className="font-semibold text-white mb-2">Chaîne</h3>
                  <p className="text-sm">{movie.channelTitle}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
