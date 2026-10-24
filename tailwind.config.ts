import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: {
            DEFAULT: "#BE933C",
            champagne: "#B79A5E",
            dark: "#9E7422",
            light: "#FBF7EE",
            border: "rgba(190, 147, 60, 0.28)",
          },
          charcoal: {
            deep: "#252A2D",
            DEFAULT: "#252A2D",
            dark: "#1F2427",
            surface: "#181B20",
            card: "#20242A",
            border: "#2E2E2E",
          },
          neutral: {
            bg: "#F5F9FC",
            canvas: "#FDFDFD",
            border: "#E5E7EB",
          },
          text: {
            primary: "#252A2D",
            secondary: "#52525B",
            muted: "#71717A",
          },
        },
      },
      fontFamily: {
        sans: [
          "'Satoshi Variable'",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        heading: [
          "'Satoshi Variable'",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["'Satoshi Variable'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        editorial:
          "0 8px 32px -4px rgba(15, 18, 21, 0.06), 0 2px 8px -2px rgba(15, 18, 21, 0.04)",
        "editorial-lg":
          "0 20px 48px -8px rgba(15, 18, 21, 0.10), 0 4px 12px -2px rgba(15, 18, 21, 0.04)",
        "gold-subtle": "0 4px 20px -2px rgba(190, 147, 60, 0.20)",
        "card-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.025em",
        wide: "0.04em",
        widest: "0.12em",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
