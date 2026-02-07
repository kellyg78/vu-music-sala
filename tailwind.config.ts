import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          pink: "#FF10F0",
          cyan: "#00F0FF",
          purple: "#B026FF",
          blue: "#4D4DFF",
          green: "#39FF14",
        },
        vaporwave: {
          dark: "#0A0E27",
          darker: "#050816",
          purple: "#6B2E9F",
          pink: "#FF6EC7",
          cyan: "#00D9FF",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        retro: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        glow: {
          'from': {
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #FF10F0, 0 0 40px #FF10F0',
          },
          'to': {
            textShadow: '0 0 20px #fff, 0 0 30px #00F0FF, 0 0 40px #00F0FF, 0 0 50px #00F0FF',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
