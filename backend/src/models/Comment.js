const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index pour récupérer rapidement les commentaires d'un contenu
commentSchema.index({ contentId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
