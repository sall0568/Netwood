import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";
import {
  Film,
  Tv,
  Calendar,
  Globe,
  Eye,
  Star,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import MovieCard from "../components/MovieCard";
import AdBanner from "../components/AdBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import RatingStars from "../components/RatingStars";
import DownloadButton from "../components/DownloadButton";
import ShareButton from "../components/ShareButton";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, token } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    // Add to history when viewing
    if (isAuthenticated && movie && movie._id) {
      api.addToHistory(token, movie._id, 0);
    }
  }, [movie, isAuthenticated, token]);

  const fetchMovie = async () => {
    setLoading(true);
    setError(null);
    
    const result = await api.getMovieById(id);
    
    if (result) {
      setMovie(result.movie);
      setSimilarMovies(result.similar);

      // Send GA Event
      ReactGA.event({
        category: "Content",
        action: "view_movie",
        label: result.movie.title,
        value: result.movie.viewCount
      });
    } else {
      setError("Film non trouvé");
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message={t("common.loading")} />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <Film className="text-gray-600 mb-4" size={80} />
        <h1 className="text-2xl font-bold mb-4">{error || "Film non trouvé"}</h1>
        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2 transition"
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // Get best thumbnail
  const thumbnail =
    movie.thumbnails?.maxres?.url ||
    movie.thumbnails?.high?.url ||
    movie.thumbnails?.medium?.url ||
    movie.thumbnails?.default?.url ||
    "";

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{movie.title} - NetWood | Films Nigérians</title>
        <meta
          name="description"
          content={movie.description?.substring(0, 160) || `Regardez ${movie.title} sur NetWood`}
        />
        <meta property="og:title" content={`${movie.title} - NetWood`} />
        <meta
          property="og:description"
          content={movie.description?.substring(0, 160) || `Regardez ${movie.title} sur NetWood`}
        />
        <meta property="og:image" content={thumbnail} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${movie.title} - NetWood`} />
        <meta name="twitter:image" content={thumbnail} />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition"
          >
            <ArrowLeft size={20} />
            Retour
          </button>

          {/* Top Ad Banner */}
          <div className="mb-6">
            <AdBanner 
              slot="MOVIE_TOP_SLOT" 
              format="horizontal" 
              style={{ minHeight: '90px' }}
            />
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${movie.videoId}?autoplay=0&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={movie.title}
            />
          </div>

          {/* Movie Details */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-xl">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <span className="flex items-center gap-2 text-gray-300">
                {movie.contentType === "movie" ? (
                  <Film size={16} />
                ) : (
                  <Tv size={16} />
                )}
                <span className="capitalize font-medium">
                  {movie.contentType === "movie" ? "Film" : "Série TV"}
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
                  <Link
                    key={idx}
                    to={`/category/${g}`}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm capitalize font-medium transition"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {isAuthenticated && <DownloadButton movie={movie} />}
              <ShareButton movie={movie} />
            </div>

            {/* Rating Section */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-white text-lg mb-3">
                Votre note
              </h3>
              <RatingStars contentId={movie._id} size={32} showLabel={true} />
            </div>

            {/* Description */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="font-semibold text-white text-lg mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            </div>

            {/* Middle Ad Banner */}
            <div className="mt-6">
              <AdBanner 
                slot="MOVIE_MIDDLE_SLOT" 
                format="auto" 
              />
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6 mt-6 border-t border-gray-700 pt-6">
              {movie.cast && movie.cast.length > 0 && (
                <div className="text-gray-300">
                  <h3 className="font-semibold text-white mb-2">Distribution</h3>
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

          {/* Comments Section */}
          <CommentsSection contentId={movie._id} />

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                🎬 Films similaires
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarMovies.map((m) => (
                  <MovieCard
                    key={m._id || m.videoId}
                    movie={m}
                    onClick={() => navigate(`/movie/${m._id || m.videoId}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Movie;
