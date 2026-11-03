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
          300: "#E8D5B0",
          400: "#D6B982",
          500: "#C6A364",
          600: "#9E7835",
        },
        ivory: {
          50: "#FAF8F5",
          100: "#F3EFE8",
          200: "#E6DFD3",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #E8D5B0 0%, #C6A364 52%, #9E7835 100%)",
        "obsidian-radial":
          "radial-gradient(circle at 50% 0%, rgba(198, 163, 100, 0.14) 0%, rgba(6, 7, 9, 0) 65%)",
      },
      boxShadow: {
        luxury: "var(--shadow-luxury)",
        "gold-glow": "0 8px 30px -4px rgba(198, 163, 100, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
