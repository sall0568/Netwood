const User = require("../models/User");
const Content = require("../models/Content");
const logger = require("../config/logger");

/**
 * @route   POST /api/history/:contentId
 * @desc    Ajouter un film à l'historique
 * @access  Private
 */
const addToHistory = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { progress = 0 } = req.body; // Pourcentage de visionnage
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

    // Vérifier si déjà dans l'historique
    const existingIndex = user.watchHistory.findIndex(
      (item) => item.contentId.toString() === contentId
    );

    if (existingIndex !== -1) {
      // Mettre à jour la progression et la date
      user.watchHistory[existingIndex].progress = progress;
      user.watchHistory[existingIndex].watchedAt = new Date();
    } else {
      // Ajouter à l'historique
      user.watchHistory.unshift({
        contentId,
        progress,
        watchedAt: new Date(),
      });
    }

    // Limiter l'historique à 100 éléments
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(0, 100);
    }

    await user.save();

    logger.info(`User ${user.email} added content ${contentId} to history`);

    return res.status(200).json({
      success: true,
      message: "Ajouté à l'historique",
    });
  } catch (error) {
    logger.error(`Add to history error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'ajout à l'historique",
    });
  }
};

/**
 * @route   GET /api/history
 * @desc    Récupérer l'historique de visionnage
 * @access  Private
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur avec son historique
    const user = await User.findById(userId).populate({
      path: "watchHistory.contentId",
    });

    // Filtrer les éléments valides et appliquer la pagination
    const validHistory = user.watchHistory.filter(
      (item) => item.contentId !== null
    );
    const paginatedHistory = validHistory.slice(skip, skip + limit);

    const totalCount = validHistory.length;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      count: paginatedHistory.length,
      page,
      pages: totalPages,
      totalCount,
      data: paginatedHistory,
    });
  } catch (error) {
    logger.error(`Get history error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de l'historique",
    });
  }
};

/**
 * @route   DELETE /api/history/:contentId
 * @desc    Retirer un film de l'historique
 * @access  Private
 */
const removeFromHistory = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Retirer de l'historique
    user.watchHistory = user.watchHistory.filter(
      (item) => item.contentId.toString() !== contentId
    );

    await user.save();

    logger.info(`User ${user.email} removed content ${contentId} from history`);

    return res.status(200).json({
      success: true,
      message: "Retiré de l'historique",
    });
  } catch (error) {
    logger.error(`Remove from history error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors du retrait de l'historique",
    });
  }
};

/**
 * @route   DELETE /api/history
 * @desc    Effacer tout l'historique
 * @access  Private
 */
const clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.watchHistory = [];
    await user.save();

    logger.info(`User ${user.email} cleared watch history`);

    return res.status(200).json({
      success: true,
      message: "Historique effacé",
    });
  } catch (error) {
    logger.error(`Clear history error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'effacement de l'historique",
    });
  }
};

module.exports = {
  addToHistory,
  getHistory,
  removeFromHistory,
  clearHistory,
};
