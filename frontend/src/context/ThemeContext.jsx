import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user, updatePreferences } = useAuth();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Charger le thème depuis localStorage ou les préférences utilisateur
    const savedTheme =
      localStorage.getItem("theme") || user?.preferences?.theme || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, [user]);

  const applyTheme = (newTheme) => {
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Si l'utilisateur est connecté, sauvegarder dans ses préférences
    if (user) {
      await updatePreferences({ theme: newTheme });
    }
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
