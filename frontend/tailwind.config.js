/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core Brand Palettes */
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#243B53",
          900: "#102A43",
          950: "#0B1D30",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#042F2E",
        },
        mint: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#A7F3D0",
          300: "#6EE7B7",
        },

        /* Semantic Tokens wired to CSS Variables */
        app: "var(--bg-app)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          elevated: "var(--bg-surface-elevated)",
          hover: "var(--bg-surface-hover)",
          subtle: "var(--bg-surface-subtle)",
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        edge: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        brand: {
          primary: "var(--primary)",
          "primary-hover": "var(--primary-hover)",
          "primary-light": "var(--primary-light)",
          "primary-foreground": "var(--primary-foreground)",
          secondary: "var(--secondary)",
          "secondary-hover": "var(--secondary-hover)",
          "secondary-light": "var(--secondary-light)",
          "secondary-foreground": "var(--secondary-foreground)",
        },
        status: {
          success: "var(--success)",
          "success-light": "var(--success-light)",
          warning: "var(--warning)",
          "warning-light": "var(--warning-light)",
          error: "var(--error)",
          "error-light": "var(--error-light)",
          info: "var(--info)",
          "info-light": "var(--info-light)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        healthcare: "0 2px 8px -2px rgba(16, 42, 67, 0.06), 0 1px 4px -1px rgba(16, 42, 67, 0.04)",
        "healthcare-md": "0 4px 16px -2px rgba(16, 42, 67, 0.08), 0 2px 6px -1px rgba(16, 42, 67, 0.05)",
        "healthcare-lg": "0 12px 28px -4px rgba(16, 42, 67, 0.12), 0 4px 10px -2px rgba(16, 42, 67, 0.06)",
        "teal-glow": "0 0 20px -3px rgba(13, 148, 136, 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
