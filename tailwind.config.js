/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Keeps your fallback utilities flexible
        jakarta: ['Jakarta', 'sans-serif'],
        rosemary: ['Rosemary', 'sans-serif'],
        chocolate: ['Chocolate','sans-serif'],
        comfortaa: ['Comfortaa','sans-serif'],
        delius: ['Delius','sans-serif'],
        patrickhand: ['Patrickhand','sans-serif'],
        poppins: ['Poppins','sans-serif'],
        gummyminimal: ['Gummymimimal','sans-serif'],
        outfit: ['Outfit','sans-serif'],
        geist: ['Geist','sans-serif'],
        inter: ['Inter','sans-serif'],
        urbanist: ['Urbanist','sans-serif'],

        //figtree: ['Figtree', 'sans-serif'],
        
        // This maps the default 'font-sans' utilities to use your CSS-controlled cascade
        sans: ['Jakarta', 'Rosemary', 'Chocolate', 'Comfortaa', 'Delius' , 'Patrickhand', 'Gummymimimal', 'Outfit', 'Geist', 'Inter', 'Urbanist', 'sans-serif'],
      },
    },
  },
  plugins: [],
};