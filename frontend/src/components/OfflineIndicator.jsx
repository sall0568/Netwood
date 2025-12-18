import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-down">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl ${
          isOnline ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi size={20} />
            <span className="font-semibold">Connexion rétablie</span>
          </>
        ) : (
          <>
            <WifiOff size={20} />
            <span className="font-semibold">Mode hors ligne</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
