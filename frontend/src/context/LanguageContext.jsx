import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import frTranslations from "../locales/fr.json";
import enTranslations from "../locales/en.json";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  fr: frTranslations,
  en: enTranslations,
};

export const LanguageProvider = ({ children }) => {
  const { user, updatePreferences } = useAuth();
  const [language, setLanguage] = useState("fr");

  useEffect(() => {
    // Charger la langue depuis localStorage ou les préférences utilisateur
    const savedLanguage =
      localStorage.getItem("language") || user?.preferences?.language || "fr";
    setLanguage(savedLanguage);
  }, [user]);

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);

    // Si l'utilisateur est connecté, sauvegarder dans ses préférences
    if (user) {
      await updatePreferences({ language: newLanguage });
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key; // Retourner la clé si traduction non trouvée
      }
    }

    return value;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: "fr", name: "Français", flag: "🇫🇷" },
      { code: "en", name: "English", flag: "🇬🇧" },
    ],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
