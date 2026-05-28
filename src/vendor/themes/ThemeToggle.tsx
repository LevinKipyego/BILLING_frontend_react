import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      // Set the body background directly to match your specific requirement
      root.classList.remove("bg-gray-900");
      root.classList.add("bg-black");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      // Fallback light mode uses the gray-900 look you requested
      root.classList.remove("bg-black");
      root.classList.add("bg-gray-900");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="group relative p-2 rounded-[11px] transition-all duration-500 
        bg-gray-500/20 dark:bg-slate-500/20
        text-gray-400 hover:text-white
        border border-white/10 shadow-2xl hover:bg-gray-800 dark:hover:bg-white/5"
      aria-label="Toggle Dark Mode"
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
      
      <div className="relative">
        {darkMode ? (
          <SunIcon className="w-7 h-3 text-yellow-400 animate-in zoom-in spin-in-90 duration-500" />
        ) : (
          <MoonIcon className="w-7 h-3 text-blue-400 animate-in zoom-in spin-in-45 duration-500" />
        )}
      </div>
    </button>
  );
}