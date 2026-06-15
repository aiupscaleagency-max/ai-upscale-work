/** @type {import('tailwindcss').Config} */
// Designsystem: amber #d97706 som primärfärg, varm grå bg, vita kort
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Skinande grön – #00d97e (neon emerald)
        primary: {
          DEFAULT: "#00d97e",
          dark: "#00b368",
          light: "#34f5a0",
          50: "#ecfdf5",
          100: "#d1fae5",
        },
        bg: "#f6f8f7",
        card: "#ffffff",
        // Digital-yta för paneler
        panel: {
          DEFAULT: "#0f1620",
          light: "#1a2332",
          line: "#2a3548",
        },
        branch: {
          el: "#00d97e",
          vvs: "#0284c7",
          entreprenad: "#57534e",
          snickeri: "#92400e",
          maleri: "#db2777",
          tak: "#475569",
          golv: "#737373",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 4px 12px -2px rgb(0 0 0 / 0.08)",
        glow: "0 0 24px rgba(0, 217, 126, 0.4)",
        "glow-sm": "0 0 12px rgba(0, 217, 126, 0.3)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
