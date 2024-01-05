/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // or 'media' or 'class'
  content: ["src/**/*.{tsx,vue}", "components/**/*.{tsx,vue}", "./entry.tsx"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["winter"],
  }
}

