/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Generates font-rosemary class
        rosemary: ['Rosemary', 'sans-serif'],
        // Generates font-gummyminimal class
        outfit: ['Outfit', 'sans-serif'],
        
      },
    },
  },
  plugins: [],
};