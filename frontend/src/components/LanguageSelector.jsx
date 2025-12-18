import React, { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = availableLanguages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
        title="Changer de langue"
      >
        <Globe size={20} className="text-white" />
        <span className="text-white text-sm">{currentLang?.flag}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-xl py-2 z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-700 transition ${
                  language === lang.code ? "bg-gray-700" : ""
                }`}
              >
                <span>{lang.flag}</span>
                <span className="text-white text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
