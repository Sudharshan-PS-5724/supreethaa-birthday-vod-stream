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
        background: "#050508",
        foreground: "#f3f4f6",
        pink: {
          300: "#f472b6",
          400: "#f43f5e",
          500: "#ec4899",
          200: "#fbcfe8",
        },
        rose: {
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
        },
        brand: {
          purple: "#7c3aed",
          pink: "#f472b6",
          violet: "#8b5cf6",
          dark: "#0a0812",
          card: "#120e1d",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "birthday-glow": "radial-gradient(circle at 50% 0%, rgba(244, 114, 182, 0.18), rgba(236, 72, 153, 0.1) 50%, transparent 80%)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
