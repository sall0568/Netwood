const User = require("../models/User");
const Content = require("../models/Content");
const logger = require("../config/logger");

/**
 * @route   GET /api/recommendations
 * @desc    Obtenir des recommandations personnalisées
 * @access  Private
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    // Récupérer l'utilisateur avec historique et notes
    const user = await User.findById(userId)
      .populate("watchHistory.contentId")
      .populate("ratings.contentId");

    // Extraire les genres favoris de l'historique
    const genresMap = {};
    const languagesMap = {};

    // Analyser l'historique
    user.watchHistory.forEach((item) => {
      if (item.contentId && item.contentId.genre) {
        item.contentId.genre.forEach((genre) => {
          genresMap[genre] = (genresMap[genre] || 0) + 1;
        });
      }
      if (item.contentId && item.contentId.language) {
        languagesMap[item.contentId.language] =
          (languagesMap[item.contentId.language] || 0) + 1;
      }
    });

    // Analyser les notes (donner plus de poids aux contenus bien notés)
    user.ratings.forEach((item) => {
      if (item.rating >= 4 && item.contentId && item.contentId.genre) {
        item.contentId.genre.forEach((genre) => {
          genresMap[genre] = (genresMap[genre] || 0) + 2; // Double poids
        });
      }
    });

    // Trier les genres par popularité
    const topGenres = Object.entries(genresMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    // Trier les langues par popularité
    const topLanguages = Object.entries(languagesMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([lang]) => lang);

    // Récupérer les IDs déjà vus
    const watchedIds = user.watchHistory
      .map((item) => item.contentId?._id)
      .filter(Boolean);

    // Construire la requête de recommandation
    const query = {
      _id: { $nin: watchedIds }, // Exclure les contenus déjà vus
    };

    // Ajouter les filtres de genres et langues si disponibles
    if (topGenres.length > 0) {
      query.genre = { $in: topGenres };
    }

    if (topLanguages.length > 0) {
      query.language = { $in: topLanguages };
    }

    // Récupérer les recommandations
    const recommendations = await Content.find(query)
      .sort({ viewCount: -1, likeCount: -1 }) // Trier par popularité
      .limit(limit);

    // Si pas assez de recommandations, ajouter du contenu populaire
    if (recommendations.length < limit) {
      const additionalContent = await Content.find({
        _id: {
          $nin: [...watchedIds, ...recommendations.map((r) => r._id)],
        },
      })
        .sort({ viewCount: -1 })
        .limit(limit - recommendations.length);

      recommendations.push(...additionalContent);
    }

    logger.info(
      `Generated ${recommendations.length} recommendations for user ${user.email}`
    );

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
      metadata: {
        topGenres,
        topLanguages,
      },
    });
  } catch (error) {
    logger.error(`Get recommendations error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la génération des recommandations",
    });
  }
};

/**
 * @route   GET /api/recommendations/similar/:contentId
 * @desc    Obtenir des contenus similaires
 * @access  Public
 */
const getSimilarContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Récupérer le contenu de référence
    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Contenu non trouvé",
      });
    }

    // Trouver des contenus similaires basés sur genre et langue
    const similarContent = await Content.find({
      _id: { $ne: contentId },
      $or: [
        { genre: { $in: content.genre } },
        { language: content.language },
        { director: content.director },
        { cast: { $in: content.cast } },
      ],
    })
      .sort({ viewCount: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: similarContent.length,
      data: similarContent,
    });
  } catch (error) {
    logger.error(`Get similar content error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des contenus similaires",
    });
  }
};

module.exports = {
  getRecommendations,
  getSimilarContent,
};
