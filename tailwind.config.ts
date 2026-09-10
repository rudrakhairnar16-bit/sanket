import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f3f9", 100: "#d9e0f0", 200: "#b3c1e0", 300: "#8da2d1", 400: "#6783c1", 500: "#4164b2", 600: "#34508e", 700: "#273c6b", 800: "#1a2847", 900: "#0b1120", 950: "#060912",
        },
        gold: {
          50: "#fdf8ed", 100: "#f9edd0", 200: "#f3dba1", 300: "#edc972", 400: "#c9a961", 500: "#d4a843", 600: "#b8892a", 700: "#8c6720", 800: "#604515", 900: "#34230b",
        },
        teal: {
          50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a",
        },
        ink: {
          950: "#05070d",
          900: "#080b13",
          850: "#0b0f1a",
          800: "#101525",
          700: "#171e33",
        },
        mist: {
          100: "#edeff5",
          300: "#c2c8d6",
          400: "#9aa3b5",
          500: "#707a8f",
        },
        tealx: {
          300: "#7ee0d2",
          400: "#3ec6b8",
          500: "#25a89b",
        },
        bluex: {
          300: "#9dbcf7",
          400: "#6d9bf5",
          500: "#4a7de8",
        },
        greenx: {
          400: "#4cc38a",
        },
        orangex: {
          300: "#f2a768",
          400: "#e8863c",
        },
      },
      fontFamily: { sans: ["Manrope", "Inter", "system-ui", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: "0", transform: "translateY(-10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        glowPulse: { "0%, 100%": { boxShadow: "0 0 20px rgba(201, 169, 97, 0.3)" }, "50%": { boxShadow: "0 0 40px rgba(201, 169, 97, 0.6)" } },
      },
    },
  },
  plugins: [],
};
export default config;
