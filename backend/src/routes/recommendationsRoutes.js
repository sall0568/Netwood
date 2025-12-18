const express = require("express");
const {
  getRecommendations,
  getSimilarContent,
} = require("../controllers/recommendationsController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

/**
 * @route   GET /api/recommendations
 * @desc    Obtenir des recommandations personnalisées
 * @access  Private
 */
router.get("/", protect, getRecommendations);

/**
 * @route   GET /api/recommendations/similar/:contentId
 * @desc    Obtenir des contenus similaires
 * @access  Public
 */
router.get("/similar/:contentId", getSimilarContent);

module.exports = router;
