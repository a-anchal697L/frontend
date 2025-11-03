/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 👈 important for manual toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
};
