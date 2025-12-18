import React from "react";
import { Link } from "react-router-dom";
import { Film, Tv, Play, Star, Eye } from "lucide-react";
import { api } from "../services/api";
import FavoriteButton from "./FavoriteButton";

const MovieCard = ({ movie, onClick }) => {
  const movieId = movie._id || movie.videoId;
  
  // Wrapper component - Link if no onClick, div if onClick provided
  const CardWrapper = onClick ? 'div' : Link;
  const wrapperProps = onClick 
    ? { onClick: () => onClick(movie) }
    : { to: `/movie/${movieId}` };

  return (
    <CardWrapper
      {...wrapperProps}
      className="block bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-2xl"
    >
      {/* Thumbnail */}
      <div className="relative pb-[56.25%]">
        <img
          src={
            movie.thumbnails?.high?.url ||
            movie.thumbnails?.medium?.url ||
            movie.thumbnails?.default?.url
          }
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
            {movie.contentType === "movie" ? (
              <Film size={14} />
            ) : (
              <Tv size={14} />
            )}
            <span className="capitalize">{movie.contentType}</span>
            {movie.releaseYear && <span>• {movie.releaseYear}</span>}
          </div>
        </div>

        {/* HD Badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <Play size={12} />
          HD
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 left-2" onClick={(e) => e.preventDefault()}>
          <FavoriteButton contentId={movie._id} size={20} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 min-h-[40px]">
          {movie.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {api.formatNumber(movie.viewCount)}
          </span>
          {movie.likeCount > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              {api.formatNumber(movie.likeCount)}
            </span>
          )}
        </div>

        {/* Genres */}
        {movie.genre && movie.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs capitalize"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default MovieCard;
