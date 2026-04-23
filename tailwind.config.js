/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6C47FF",
        "primary-dark": "#5235CC",
        accent: "#FF6B6B",
        dark: "#0A0A0A",
        "dark-2": "#1A1A1A",
        "dark-3": "#2A2A2A",
        "gray-light": "#F5F5F5",
        "gray-mid": "#9CA3AF",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
