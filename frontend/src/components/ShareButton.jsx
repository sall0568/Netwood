import React, { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Link2,
  Check,
  MessageCircle,
} from "lucide-react";

const ShareButton = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/?movie=${movie.videoId}`;
  const shareText = `Regardez "${movie.title}" sur NetWood !`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 2000);
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      "_blank"
    );
  };

  // Web Share API (natif mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
        title="Partager"
      >
        <Share2 size={20} />
        <span>Partager</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl p-4 z-50">
            <h3 className="text-white font-semibold mb-3">Partager ce film</h3>

            <div className="space-y-2">
              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center gap-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-3 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
              >
                <Twitter size={20} />
                <span>Twitter</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    <span>Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Link2 size={20} />
                    <span>Copier le lien</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
