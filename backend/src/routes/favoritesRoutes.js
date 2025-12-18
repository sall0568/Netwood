const express = require("express");
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
} = require("../controllers/favoritesController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

/**
 * @route   GET /api/favorites
 * @desc    Récupérer tous les favoris
 * @access  Private
 */
router.get("/", getFavorites);

/**
 * @route   POST /api/favorites/:contentId
 * @desc    Ajouter aux favoris
 * @access  Private
 */
router.post("/:contentId", addToFavorites);

/**
 * @route   DELETE /api/favorites/:contentId
 * @desc    Retirer des favoris
 * @access  Private
 */
router.delete("/:contentId", removeFromFavorites);

/**
 * @route   GET /api/favorites/check/:contentId
 * @desc    Vérifier si dans les favoris
 * @access  Private
 */
router.get("/check/:contentId", checkFavorite);

module.exports = router;
