/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1B4332",
        "forest-light": "#2D6A4F",
        "forest-muted": "#E9F5EE",
        amber: "#F4A522",
        "amber-light": "#FEF3DC",
        offwhite: "#F9F7F2",
        charcoal: "#1C1C1E",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};