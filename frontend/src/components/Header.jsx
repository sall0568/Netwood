import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Film, TrendingUp, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import CategoryMenu from "./CategoryMenu";

const Header = ({ categories = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleCategoryClick = (genre) => {
    navigate(`/category/${genre}`);
    setMenuOpen(false);
  };

  return (
    <header className="bg-black/95 backdrop-blur sticky top-0 z-40 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Film className="text-red-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">NetWood</h1>
              <p className="text-xs text-gray-400">Films Nigérians</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <TrendingUp size={20} />
              {t("nav.trending")}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Menu size={20} />
              {t("nav.categories")}
            </button>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("nav.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-64 transition"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400 cursor-pointer hover:text-white transition"
                size={20}
                onClick={handleSearch}
              />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <User size={20} className="text-white" />
                  <span className="text-white text-sm">{user?.username}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("nav.profile")}
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("nav.favorites")}
                    </Link>
                    <Link
                      to="/history"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t("nav.history")}
                    </Link>
                    <Link
                      to="/downloads"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Téléchargements
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search & Actions */}
        <div className="md:hidden mt-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("nav.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-full"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
              size={20}
              onClick={handleSearch}
            />
          </div>

          {/* Mobile User Actions & Settings */}
          <div className="flex flex-col gap-4 border-t border-gray-800 pt-4">
            <div className="flex items-center justify-end gap-3">
              <ThemeToggle />
              <LanguageSelector />
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 w-full justify-between">
                <Link to="/profile" className="flex items-center gap-2 text-white">
                  <User size={20} />
                  <span className="text-sm font-medium">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-400"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 w-full">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 text-gray-300 hover:text-white bg-gray-800 rounded-lg transition"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <CategoryMenu
        categories={categories}
        onCategoryClick={handleCategoryClick}
        isOpen={menuOpen}
      />
    </header>
  );
};

export default Header;
