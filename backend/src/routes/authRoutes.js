const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePreferences,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer l'utilisateur connecté
 * @access  Private
 */
router.get("/me", protect, getMe);

/**
 * @route   PUT /api/auth/update
 * @desc    Mettre à jour le profil utilisateur
 * @access  Private
 */
router.put("/update", protect, updateProfile);

/**
 * @route   PUT /api/auth/preferences
 * @desc    Mettre à jour les préférences utilisateur
 * @access  Private
 */
router.put("/preferences", protect, updatePreferences);

module.exports = router;
