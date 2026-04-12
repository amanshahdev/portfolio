/** @type {import('tailwindcss').Config} */
const colorVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

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
        white: colorVar("--white-rgb"),
        black: colorVar("--black-rgb"),
        void: colorVar("--void-rgb"),
        "void-1": colorVar("--void-1-rgb"),
        "void-2": colorVar("--void-2-rgb"),
        "void-3": colorVar("--void-3-rgb"),
        phosphor: colorVar("--phosphor-rgb"),
        "phosphor-dim": colorVar("--phosphor-dim-rgb"),
        "phosphor-glow": "var(--phosphor-glow)",
        aurora: colorVar("--aurora-rgb"),
        "aurora-2": colorVar("--aurora-2-rgb"),
        plasma: colorVar("--plasma-rgb"),
        ice: colorVar("--ice-rgb"),
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        "border-1": "var(--border-1)",
        "border-2": "var(--border-2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "phosphor-gradient":
          "linear-gradient(135deg, rgb(var(--phosphor-rgb)) 0%, rgb(var(--phosphor-dim-rgb)) 100%)",
        "aurora-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
        "void-gradient": "linear-gradient(180deg, #050508 0%, #0a0a12 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        typewriter: "typewriter 3s steps(30) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(var(--phosphor-rgb),0.3)",
          },
          "50%": { boxShadow: "0 0 40px rgba(var(--phosphor-rgb),0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        phosphor: "0 0 30px rgba(var(--phosphor-rgb),0.3)",
        "phosphor-lg": "0 0 60px rgba(var(--phosphor-rgb),0.4)",
        aurora: "0 0 30px rgba(124,58,237,0.4)",
        glass:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "card-hover":
          "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(var(--phosphor-rgb),0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
