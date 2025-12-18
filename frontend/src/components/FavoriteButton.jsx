import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const FavoriteButton = ({ contentId, size = 24 }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && contentId) {
      checkIfFavorite();
    }
  }, [contentId, isAuthenticated]);

  const checkIfFavorite = async () => {
    const result = await api.checkFavorite(token, contentId);
    setIsFavorite(result);
  };

  const handleClick = async (e) => {
    e.stopPropagation(); // Empêcher la propagation du clic

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);

    if (isFavorite) {
      const result = await api.removeFromFavorites(token, contentId);
      if (result.success) {
        setIsFavorite(false);
      }
    } else {
      const result = await api.addToFavorites(token, contentId);
      if (result.success) {
        setIsFavorite(true);
      }
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full transition ${
        isFavorite
          ? "bg-red-600 hover:bg-red-700"
          : "bg-gray-700 hover:bg-gray-600"
      } disabled:opacity-50`}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        size={size}
        className={`${isFavorite ? "fill-white text-white" : "text-white"}`}
      />
    </button>
  );
};

export default FavoriteButton;
