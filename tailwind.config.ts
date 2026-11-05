import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        field: "rgb(var(--c-field) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        subtle: "rgb(var(--c-subtle) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        obsidian: {
          950: "#060709",
          900: "#0B0C10",
          850: "#101218",
          800: "#151821",
          700: "#1E222E",
        },
        champagne: {
          300: "#F2D488",
          400: "#E8C164",
          500: "#D4A847",
          600: "#A87E28",
        },
        ivory: {
          50: "#FAF8F5",
          100: "#F3EFE8",
          200: "#E6DFD3",
        },
      },
      fontFamily: {
        serif: ['"Montserrat"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Montserrat"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #F3D586 0%, #DFB453 52%, #B8892B 100%)",
        "obsidian-radial":
          "radial-gradient(circle at 50% 0%, rgba(223, 180, 83, 0.14) 0%, rgba(6, 7, 9, 0) 65%)",
      },
      boxShadow: {
        luxury: "var(--shadow-luxury)",
        "gold-glow": "0 8px 30px -4px rgba(223, 180, 83, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
