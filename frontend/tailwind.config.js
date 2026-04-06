/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Cabinet Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void: "#050508",
        "void-1": "#0a0a12",
        "void-2": "#0f0f1a",
        "void-3": "#16162a",
        phosphor: "#00ff88",
        "phosphor-dim": "#00cc6e",
        "phosphor-glow": "rgba(0,255,136,0.15)",
        aurora: "#7c3aed",
        "aurora-2": "#a855f7",
        plasma: "#f59e0b",
        ice: "#38bdf8",
        "surface-1": "rgba(255,255,255,0.03)",
        "surface-2": "rgba(255,255,255,0.06)",
        "surface-3": "rgba(255,255,255,0.09)",
        "border-1": "rgba(255,255,255,0.06)",
        "border-2": "rgba(255,255,255,0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "phosphor-gradient": "linear-gradient(135deg, #00ff88 0%, #00cc6e 100%)",
        "aurora-gradient": "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
        "void-gradient": "linear-gradient(180deg, #050508 0%, #0a0a12 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "typewriter": "typewriter 3s steps(30) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,255,136,0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        phosphor: "0 0 30px rgba(0,255,136,0.3)",
        "phosphor-lg": "0 0 60px rgba(0,255,136,0.4)",
        aurora: "0 0 30px rgba(124,58,237,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,136,0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
