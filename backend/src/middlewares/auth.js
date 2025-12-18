const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");

// Protéger les routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Récupérer le token du header
      token = req.headers.authorization.split(" ")[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur (sans le mot de passe)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Utilisateur non trouvé",
        });
      }

      next();
    } catch (error) {
      logger.error(`Auth middleware error: ${error.message}`);
      return res.status(401).json({
        success: false,
        error: "Non autorisé, token invalide",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Non autorisé, pas de token",
    });
  }
};

// Générer un JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

module.exports = { protect, generateToken };
