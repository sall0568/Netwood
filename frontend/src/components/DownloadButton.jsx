import React, { useState } from "react";
import { Download, Check } from "lucide-react";

const DownloadButton = ({ movie }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Sauvegarder les informations du film dans localStorage pour accès offline
      const offlineMovies = JSON.parse(
        localStorage.getItem("offlineMovies") || "[]"
      );

      // Vérifier si déjà téléchargé
      const alreadyDownloaded = offlineMovies.find((m) => m._id === movie._id);

      if (!alreadyDownloaded) {
        offlineMovies.push({
          _id: movie._id,
          videoId: movie.videoId,
          title: movie.title,
          description: movie.description,
          thumbnails: movie.thumbnails,
          genre: movie.genre,
          language: movie.language,
          releaseYear: movie.releaseYear,
          downloadedAt: new Date().toISOString(),
        });

        localStorage.setItem("offlineMovies", JSON.stringify(offlineMovies));
      }

      setDownloaded(true);

      // Note: Le téléchargement réel de la vidéo nécessite une solution backend
      // car YouTube ne permet pas le téléchargement direct depuis le navigateur
      // Cette implémentation sauvegarde juste les métadonnées

      setTimeout(() => {
        setDownloading(false);
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading || downloaded}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        downloaded
          ? "bg-green-600 cursor-default"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white disabled:opacity-50`}
      title={downloaded ? "Téléchargé" : "Télécharger pour regarder hors ligne"}
    >
      {downloaded ? (
        <>
          <Check size={20} />
          <span>Téléchargé</span>
        </>
      ) : (
        <>
          <Download size={20} className={downloading ? "animate-bounce" : ""} />
          <span>{downloading ? "Téléchargement..." : "Télécharger"}</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
