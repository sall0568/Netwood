const express = require("express");
const {
  rateContent,
  getUserRating,
  getAllUserRatings,
  deleteRating,
} = require("../controllers/ratingsController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

/**
 * @route   GET /api/ratings
 * @desc    Récupérer toutes les notes de l'utilisateur
 * @access  Private
 */
router.get("/", getAllUserRatings);

/**
 * @route   POST /api/ratings/:contentId
 * @desc    Noter un contenu
 * @access  Private
 */
router.post("/:contentId", rateContent);

/**
 * @route   GET /api/ratings/:contentId
 * @desc    Récupérer la note pour un contenu
 * @access  Private
 */
router.get("/:contentId", getUserRating);

/**
 * @route   DELETE /api/ratings/:contentId
 * @desc    Supprimer une note
 * @access  Private
 */
router.delete("/:contentId", deleteRating);

module.exports = router;
