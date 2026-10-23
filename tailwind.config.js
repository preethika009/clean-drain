/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary brand - deep teal/cyan water theme
        primary: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        // Secondary - deep blue
        secondary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Accent - emerald for success/resolved
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Status colors
        urgent: "#ef4444",
        high: "#f97316",
        medium: "#f59e0b",
        low: "#22c55e",
        // Dark mode surfaces
        surface: {
          dark: "#0a0f1e",
          card: "#0f172a",
          elevated: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #083344 0%, #0e7490 40%, #0891b2 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)",
        "glow-gradient": "radial-gradient(ellipse at top, #0891b2 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-soft": "bounceSoft 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        slideDown: { "0%": { transform: "translateY(-20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        pulseGlow: { "0%, 100%": { boxShadow: "0 0 20px rgba(8,145,178,0.4)" }, "50%": { boxShadow: "0 0 40px rgba(8,145,178,0.8)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        bounceSoft: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(8,145,178,0.3)",
        "glow": "0 0 20px rgba(8,145,178,0.4)",
        "glow-lg": "0 0 40px rgba(8,145,178,0.5)",
        "glow-urgent": "0 0 20px rgba(239,68,68,0.5)",
        "glass": "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "elevated": "0 20px 60px rgba(0,0,0,0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
