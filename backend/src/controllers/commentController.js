const Comment = require("../models/Comment");

const commentController = {
  // Récupérer les commentaires d'un contenu
  getComments: async (req, res) => {
    try {
      const { contentId } = req.params;

      const comments = await Comment.find({ contentId })
        .populate("user", "username email") // On récupère le nom de l'utilisateur
        .sort({ createdAt: -1 }); // Plus récents en premier

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commentaires" });
    }
  },

  // Ajouter un commentaire
  addComment: async (req, res) => {
    try {
      const { contentId, text } = req.body;
      const userId = req.user._id; // Correct user ID access

      if (!text || !contentId) {
        return res
          .status(400)
          .json({ message: "Texte et ID du contenu requis" });
      }

      const newComment = new Comment({
        user: userId,
        contentId,
        text,
      });

      const savedComment = await newComment.save();

      // On peuple l'utilisateur pour le renvoyer au frontend
      await savedComment.populate("user", "username email");

      res.status(201).json(savedComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du commentaire" });
    }
  },

  // Supprimer un commentaire
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id; // Correct user ID access

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ message: "Commentaire non trouvé" });
      }

      // Vérifier que c'est bien l'auteur du commentaire
      if (comment.user.toString() !== userId.toString()) {
        // Ensure string comparison
        return res
          .status(403)
          .json({ message: "Non autorisé à supprimer ce commentaire" });
      }

      await Comment.findByIdAndDelete(id);

      res.status(200).json({ message: "Commentaire supprimé" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  },
};

module.exports = commentController;
