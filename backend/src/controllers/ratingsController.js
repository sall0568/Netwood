const User = require("../models/User");
const Content = require("../models/Content");
const logger = require("../config/logger");

/**
 * @route   POST /api/ratings/:contentId
 * @desc    Noter un film (1-5 étoiles)
 * @access  Private
 */
const rateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "La note doit être entre 1 et 5",
      });
    }

    // Vérifier si le contenu existe
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Contenu non trouvé",
      });
    }

    // Récupérer l'utilisateur
    const user = await User.findById(userId);

    // Vérifier si déjà noté
    const existingRatingIndex = user.ratings.findIndex(
      (item) => item.contentId.toString() === contentId
    );

    if (existingRatingIndex !== -1) {
      // Mettre à jour la note existante
      user.ratings[existingRatingIndex].rating = rating;
      user.ratings[existingRatingIndex].ratedAt = new Date();
    } else {
      // Ajouter une nouvelle note
      user.ratings.push({
        contentId,
        rating,
        ratedAt: new Date(),
      });
    }

    await user.save();

    logger.info(
      `User ${user.email} rated content ${contentId} with ${rating} stars`
    );

    return res.status(200).json({
      success: true,
      message: "Note enregistrée",
      data: { rating },
    });
  } catch (error) {
    logger.error(`Rate content error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'enregistrement de la note",
    });
  }
};

/**
 * @route   GET /api/ratings/:contentId
 * @desc    Récupérer la note de l'utilisateur pour un contenu
 * @access  Private
 */
const getUserRating = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const userRating = user.ratings.find(
      (item) => item.contentId.toString() === contentId
    );

    return res.status(200).json({
      success: true,
      data: userRating ? { rating: userRating.rating } : { rating: 0 },
    });
  } catch (error) {
    logger.error(`Get user rating error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de la note",
    });
  }
};

/**
 * @route   GET /api/ratings
 * @desc    Récupérer toutes les notes de l'utilisateur
 * @access  Private
 */
const getAllUserRatings = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("ratings.contentId");

    return res.status(200).json({
      success: true,
      count: user.ratings.length,
      data: user.ratings,
    });
  } catch (error) {
    logger.error(`Get all ratings error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des notes",
    });
  }
};

/**
 * @route   DELETE /api/ratings/:contentId
 * @desc    Supprimer une note
 * @access  Private
 */
const deleteRating = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    user.ratings = user.ratings.filter(
      (item) => item.contentId.toString() !== contentId
    );

    await user.save();

    logger.info(`User ${user.email} deleted rating for content ${contentId}`);

    return res.status(200).json({
      success: true,
      message: "Note supprimée",
    });
  } catch (error) {
    logger.error(`Delete rating error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de la note",
    });
  }
};

module.exports = {
  rateContent,
  getUserRating,
  getAllUserRatings,
  deleteRating,
};
