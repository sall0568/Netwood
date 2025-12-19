const API_BASE_URL = "https://netwood-tzf7.onrender.com/api";
BREAK_THE_BUILD;
console.log("Using API URL:", API_BASE_URL);
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const api = {
  // Récupérer les films tendances
  getTrendingMovies: async (limit = 20, language = null) => {
    try {
      let url = `${API_BASE_URL}/content/trending?limit=${limit}`;
      if (language) {
        url += `&language=${encodeURIComponent(language)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return [];
    }
  },

  // Récupérer les films tendances (movies seulement)
  getTrendingMoviesOnly: async (limit = 20) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/content/trending/movies?limit=${limit}`
      );
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return [];
    }
  },

  // Récupérer les séries tendances
  getTrendingTVShows: async (limit = 20) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/content/trending/tvshows?limit=${limit}`
      );
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching trending TV shows:", error);
      return [];
    }
  },

  // Rechercher des films
  searchMovies: async (query, limit = 20) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/content/search?keyword=${encodeURIComponent(
          query
        )}&limit=${limit}`
      );
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  },

  // Récupérer un film par son ID
  getMovieById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${id}`);
      const data = await response.json();
      return data.success
        ? { movie: data.data, similar: data.similar || [] }
        : null;
    } catch (error) {
      console.error("Error fetching movie by ID:", error);
      return null;
    }
  },

  // Récupérer les films par catégorie
  getMoviesByCategory: async (categoryType, categoryValue, limit = 20) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/content/category/${categoryType}/${categoryValue}?limit=${limit}`
      );
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching movies by category:", error);
      return [];
    }
  },

  // Récupérer toutes les catégories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/categories`);
      const data = await response.json();
      return data.success ? data.data : {};
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {};
    }
  },

  // Utilitaire pour formater les nombres
  formatNumber: (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  },

  // === FAVORIS ===

  // Ajouter aux favoris
  addToFavorites: async (token, contentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${contentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return { success: false, error: "Erreur réseau" };
    }
  },

  // Retirer des favoris
  removeFromFavorites: async (token, contentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${contentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return { success: false, error: "Erreur réseau" };
    }
  },

  // Vérifier si dans les favoris
  checkFavorite: async (token, contentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/favorites/check/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data.success ? data.isFavorite : false;
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  },

  // === HISTORIQUE ===

  // Récupérer l'historique
  getHistory: async (token, limit = 20) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  },

  // Ajouter à l'historique
  addToHistory: async (token, contentId, progress = 0) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${contentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding to history:", error);
      return { success: false };
    }
  },

  // Retirer de l'historique
  removeFromHistory: async (token, contentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${contentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error removing from history:", error);
      return { success: false };
    }
  },

  // Effacer tout l'historique
  clearHistory: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error clearing history:", error);
      return { success: false };
    }
  },

  // === COMMENTAIRES ===

  // Récupérer les commentaires
  getComments: async (contentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${contentId}`);
      if (!response.ok) return [];
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  },

  // Ajouter un commentaire
  addComment: async (contentId, text, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId, text }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Supprimer un commentaire
  deleteComment: async (commentId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  // === NOTATIONS ===

  // Noter un contenu
  rateContent: async (token, contentId, rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/${contentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error rating content:", error);
      return { success: false };
    }
  },

  // Récupérer la note d'un contenu
  getUserRating: async (token, contentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/${contentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.success ? data.data.rating : 0;
    } catch (error) {
      console.error("Error getting rating:", error);
      return 0;
    }
  },

  // Récupérer toutes les notes
  getAllUserRatings: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error getting all ratings:", error);
      return [];
    }
  },

  // === RECOMMANDATIONS ===

  // Récupérer les recommandations personnalisées
  getRecommendations: async (token, limit = 20) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/recommendations?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  },

  // Récupérer les contenus similaires
  getSimilarContent: async (contentId, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/recommendations/similar/${contentId}?limit=${limit}`
      );
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error getting similar content:", error);
      return [];
    }
  },
};

export default api;
