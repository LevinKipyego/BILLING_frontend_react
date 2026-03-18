import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-xl transition-all duration-300 
        bg-slate-100 text-slate-600 hover:bg-slate-200 
        dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700
        border border-transparent dark:border-slate-700 shadow-sm"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5 animate-in zoom-in duration-300" />
      ) : (
        <MoonIcon className="w-5 h-5 animate-in zoom-in duration-300" />
      )}
    </button>
  );
}