import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
          600: "#A88446",
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
          "linear-gradient(135deg, #E8D5B0 0%, #C6A364 50%, #9E7B3D 100%)",
        "obsidian-radial":
          "radial-gradient(circle at 50% 0%, rgba(198, 163, 100, 0.12) 0%, rgba(6, 7, 9, 0) 65%)",
      },
      boxShadow: {
        luxury: "0 24px 64px -12px rgba(0, 0, 0, 0.65)",
        "gold-glow": "0 0 32px -4px rgba(198, 163, 100, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
