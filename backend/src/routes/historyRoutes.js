const express = require("express");
const {
  addToHistory,
  getHistory,
  removeFromHistory,
  clearHistory,
} = require("../controllers/historyController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(protect);

/**
 * @route   GET /api/history
 * @desc    Récupérer l'historique
 * @access  Private
 */
router.get("/", getHistory);

/**
 * @route   POST /api/history/:contentId
 * @desc    Ajouter à l'historique
 * @access  Private
 */
router.post("/:contentId", addToHistory);

/**
 * @route   DELETE /api/history/:contentId
 * @desc    Retirer de l'historique
 * @access  Private
 */
router.delete("/:contentId", removeFromHistory);

/**
 * @route   DELETE /api/history
 * @desc    Effacer tout l'historique
 * @access  Private
 */
router.delete("/", clearHistory);

module.exports = router;
