import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const RatingStars = ({ contentId, size = 20, showLabel = true }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && contentId) {
      fetchRating();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, isAuthenticated]);

  const fetchRating = async () => {
    const userRating = await api.getUserRating(token, contentId);
    setRating(userRating);
  };

  const handleRate = async (value) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const result = await api.rateContent(token, contentId, value);

    if (result.success) {
      setRating(value);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={loading}
            className="transition transform hover:scale-110 disabled:opacity-50"
          >
            <Star
              size={size}
              className={`${
                star <= (hoverRating || rating)
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-400"
              } transition`}
            />
          </button>
        ))}
      </div>
      {showLabel && rating > 0 && (
        <span className="text-gray-400 text-sm">{rating}/5</span>
      )}
    </div>
  );
};

export default RatingStars;
