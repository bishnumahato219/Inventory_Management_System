/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8100d1",
        secondary: "#b500b2",
        accent: "#ff52a0",
        softAccent: "#ffa47f",
        
      },
    },
  },
  plugins: [],
};
