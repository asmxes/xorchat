/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        zoomIn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        zoomOut: {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
        },
        blurIn: {
          "0%": {
            opacity: "0",
            filter: "blur(10px)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
          },
        },
        blurOut: {
          "0%": {
            opacity: "1",
            filter: "blur(0)",
          },
          "100%": {
            opacity: "0",
            filter: "blur(10px)",
          },
        },
      },
      animation: {
        zoomIn: "zoomIn 0.15s ease-out forwards",
        zoomOut: "zoomOut 0.15s ease-out forwards",
        blurIn: "blurIn 0.15s ease-out forwards",
        blurOut: "blurOut 0.15s ease-out forwards",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        primary: "#48d597", // Example: blue
        bg: "#080f11", // Example: dark gray
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
