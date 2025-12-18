import React, { useEffect, useRef } from "react";

/**
 * AdBanner Component - Placeholder for Google AdSense ads
 * 
 * Props:
 * - slot: AdSense ad slot ID (will be provided after approval)
 * - format: "auto", "horizontal", "vertical", "rectangle"
 * - className: Additional CSS classes
 * - style: Custom inline styles
 */
const AdBanner = ({ 
  slot = "YOUR_AD_SLOT", 
  format = "auto", 
  className = "",
  style = {}
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Try to load AdSense ad if available
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log("AdSense not loaded yet");
    }
  }, []);

  // Format-specific sizes
  const formatStyles = {
    horizontal: { minHeight: "90px" },
    vertical: { minHeight: "250px" },
    rectangle: { minHeight: "250px", minWidth: "300px" },
    auto: { minHeight: "100px" },
  };

  return (
    <div 
      className={`ad-container ${className}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
        borderRadius: "8px",
        overflow: "hidden",
        ...formatStyles[format],
        ...style,
      }}
    >
      {/* Placeholder until AdSense is approved */}
      <div 
        className="ad-placeholder"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          color: "#9ca3af",
          textAlign: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ 
          fontSize: "12px", 
          fontWeight: "600",
          color: "#6b7280",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Publicité
        </div>
        <div style={{ 
          fontSize: "11px", 
          color: "#4b5563",
        }}>
          Espace publicitaire
        </div>
      </div>

      {/* Actual AdSense code (will work after approval) */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "none",
          width: "100%",
          height: "100%",
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
