import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#10141c",
        hull: "#161d2b",
        navy: "#17243b",
        cyan: "#6ed9f5",
        lavender: "#b8a7ff",
        silver: "#d9e2ec",
        mist: "#f4f7fb",
      },
      boxShadow: {
        glow: "0 0 32px rgba(110,217,245,0.24)",
        lavender: "0 0 28px rgba(184,167,255,0.18)",
      },
      fontFamily: {
        ui: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
