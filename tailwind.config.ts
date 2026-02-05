import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-kanit)", "Kanit", "system-ui", "sans-serif"],
      display: ["var(--font-kanit)", "Kanit", "system-ui", "sans-serif"],
      mono: ["SF Mono", "Monaco", "monospace"],
    },
    extend: {
      colors: {
        darkblue: "#1E213A",
        gray: {
          150: "#E7E7EB",
          250: "#A09FB1",
          350: "#88869D",
        },
        aqi: {
          excellent: "#0891b2",
          good: "#10b981",
          moderate: "#eab308",
          unhealthy: "#f97316",
          dangerous: "#ef4444",
          hazardous: "#7c3aed",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 0, 0, 0.1)",
        "glow-sm": "0 0 10px rgba(0, 0, 0, 0.1)",
        "glow-lg": "0 0 40px rgba(0, 0, 0, 0.15)",
        "inner-glow": "inset 0 0 20px rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in-right 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-shift": "gradient-shift 15s ease infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, hsla(199, 89%, 48%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(145, 63%, 49%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(45, 93%, 47%, 0.2) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
