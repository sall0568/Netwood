const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { protect } = require("../middlewares/auth");

// Routes publiques
router.get("/:contentId", commentController.getComments);

// Routes protégées (nécessitent authentification)
router.post("/", protect, commentController.addComment);
router.delete("/:id", protect, commentController.deleteComment);

module.exports = router;
