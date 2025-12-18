const User = require("../models/User");
const { generateToken } = require("../middlewares/auth");
const logger = require("../config/logger");

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "Cet utilisateur existe déjà",
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      logger.info(`New user registered: ${user.email}`);
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Données utilisateur invalides",
      });
    }
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'inscription",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier l'email et le mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Veuillez fournir un email et un mot de passe",
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Email ou mot de passe incorrect",
      });
    }

    logger.info(`User logged in: ${user.email}`);
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la connexion",
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer l'utilisateur connecté
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("favorites")
      .populate("watchHistory.contentId")
      .populate("ratings.contentId");

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du profil",
    });
  }
};

/**
 * @route   PUT /api/auth/update
 * @desc    Mettre à jour le profil utilisateur
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { username, email, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour les champs
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    logger.info(`User profile updated: ${user.email}`);
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du profil",
    });
  }
};

/**
 * @route   PUT /api/auth/preferences
 * @desc    Mettre à jour les préférences utilisateur
 * @access  Private
 */
const updatePreferences = async (req, res) => {
  try {
    const { theme, language, favoriteGenres } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour les préférences
    if (theme) user.preferences.theme = theme;
    if (language) user.preferences.language = language;
    if (favoriteGenres) user.preferences.favoriteGenres = favoriteGenres;

    await user.save();

    logger.info(`User preferences updated: ${user.email}`);
    return res.status(200).json({
      success: true,
      data: user.preferences,
    });
  } catch (error) {
    logger.error(`Update preferences error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour des préférences",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePreferences,
};
