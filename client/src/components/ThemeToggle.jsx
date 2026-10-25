import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        isDark 
          ? "bg-gray-700" 
          : "bg-amber-100"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark 
            ? "left-8 bg-gray-900 text-amber-400" 
            : "left-1 bg-amber-500 text-white"
        }`}
      >
        {isDark ? <FaMoon size={10} /> : <FaSun size={10} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
