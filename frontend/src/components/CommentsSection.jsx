import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Send, Trash2, User } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const CommentsSection = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await api.getComments(contentId);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [contentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const addedComment = await api.addComment(contentId, newComment, token);
      if (addedComment) {
        setComments([addedComment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    
    try {
      await api.deleteComment(commentId, token);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingSpinner size="sm" />;

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6">
        Commentaires ({comments.length})
      </h3>

      {/* Formulaire d'ajout */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre avis sur ce film..."
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-red-600 outline-none resize-none min-h-[80px]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed h-[80px] flex flex-col items-center justify-center gap-2"
          >
            {submitting ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <>
                <Send size={20} />
                <span>Envoyer</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-gray-700/50 rounded-lg p-4 mb-8 text-center text-gray-300">
          <p>Connectez-vous pour participer à la discussion.</p>
        </div>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-300" />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-700 rounded-lg p-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-white mr-2">
                        {comment.user?.username || "Utilisateur inconnu"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    {/* Bouton supprimer (auteur seulement) */}
                    {isAuthenticated && user && comment.user?._id === user.id && ( // Note: verify user.id key from AuthContext
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
