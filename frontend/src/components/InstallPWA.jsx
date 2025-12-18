import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    const isInstalled = localStorage.getItem("pwa-installed");
    if (isInstalled) {
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Détecter si l'app est déjà en mode standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem("pwa-installed", "true");
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installée");
      localStorage.setItem("pwa-installed", "true");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Ne plus afficher pendant 7 jours
    const dismissedUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("pwa-dismissed", dismissedUntil.toString());
  };

  // Vérifier si le prompt a été dismissé récemment
  useEffect(() => {
    const dismissedUntil = localStorage.getItem("pwa-dismissed");
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      setShowInstallPrompt(false);
    }
  }, []);

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-md mx-auto bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-2xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Download className="text-white" size={24} />
              <h3 className="text-white font-bold text-lg">
                Installer NetWood
              </h3>
            </div>
            <p className="text-white text-sm opacity-90 mb-3">
              Installez l'application pour un accès rapide et une meilleure
              expérience !
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Installer
              </button>
              <button
                onClick={handleDismiss}
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 transition ml-2"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
