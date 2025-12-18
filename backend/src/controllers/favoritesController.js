const User = require("../models/User");
const Content = require("../models/Content");
const logger = require("../config/logger");

/**
 * @route   POST /api/favorites/:contentId
 * @desc    Ajouter un film aux favoris
 * @access  Private
 */
const addToFavorites = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

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

    // Vérifier si déjà dans les favoris
    if (user.favorites.includes(contentId)) {
      return res.status(400).json({
        success: false,
        error: "Ce contenu est déjà dans vos favoris",
      });
    }

    // Ajouter aux favoris
    user.favorites.push(contentId);
    await user.save();

    logger.info(`User ${user.email} added content ${contentId} to favorites`);

    return res.status(200).json({
      success: true,
      message: "Ajouté aux favoris",
      data: user.favorites,
    });
  } catch (error) {
    logger.error(`Add to favorites error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'ajout aux favoris",
    });
  }
};

/**
 * @route   DELETE /api/favorites/:contentId
 * @desc    Retirer un film des favoris
 * @access  Private
 */
const removeFromFavorites = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    // Récupérer l'utilisateur
    const user = await User.findById(userId);

    // Vérifier si dans les favoris
    if (!user.favorites.includes(contentId)) {
      return res.status(400).json({
        success: false,
        error: "Ce contenu n'est pas dans vos favoris",
      });
    }

    // Retirer des favoris
    user.favorites = user.favorites.filter((id) => id.toString() !== contentId);
    await user.save();

    logger.info(
      `User ${user.email} removed content ${contentId} from favorites`
    );

    return res.status(200).json({
      success: true,
      message: "Retiré des favoris",
      data: user.favorites,
    });
  } catch (error) {
    logger.error(`Remove from favorites error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors du retrait des favoris",
    });
  }
};

/**
 * @route   GET /api/favorites
 * @desc    Récupérer tous les favoris de l'utilisateur
 * @access  Private
 */
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur avec ses favoris
    const user = await User.findById(userId).populate({
      path: "favorites",
      options: {
        limit,
        skip,
      },
    });

    // Compter le nombre total de favoris
    const totalCount = user.favorites.length;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      count: user.favorites.length,
      page,
      pages: totalPages,
      totalCount,
      data: user.favorites,
    });
  } catch (error) {
    logger.error(`Get favorites error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des favoris",
    });
  }
};

/**
 * @route   GET /api/favorites/check/:contentId
 * @desc    Vérifier si un contenu est dans les favoris
 * @access  Private
 */
const checkFavorite = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const isFavorite = user.favorites.includes(contentId);

    return res.status(200).json({
      success: true,
      isFavorite,
    });
  } catch (error) {
    logger.error(`Check favorite error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la vérification",
    });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
};
