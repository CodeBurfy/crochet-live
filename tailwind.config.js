/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#faf5ec",
        parchment: "#f3ead9",
        ink: "#2e2a25",
        "ink-soft": "#5c554b",
        clay: "#c05b3c",
        "clay-dark": "#9c4527",
        sage: "#7d8c6f",
        blush: "#f3e2cf",
        gold: "#d9a441",
      },
    },
  },
  plugins: [],
};
