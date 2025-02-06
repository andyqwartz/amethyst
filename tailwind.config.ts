import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          hover: "#8a74f2",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          hover: "#6d5899",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#D6BCFA",
          foreground: "#1A1F2C",
        },
        card: {
          DEFAULT: "rgba(26, 31, 44, 0.95)",
          foreground: "hsl(var(--foreground))",
        },
        popover: {
          DEFAULT: "#1A1F2C",
          foreground: "#ffffff",
        },
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(155, 135, 245, 0.1)" },
          "50%": { borderColor: "rgba(155, 135, 245, 0.3)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "scale": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        "gradient": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.4",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.2",
            transform: "scale(1.05)",
          },
        },
        "pulse-slower": {
          "0%, 100%": {
            opacity: "0.3",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.15",
            transform: "scale(1.03)",
          },
        },
        "pulse-slowest": {
          "0%, 100%": {
            opacity: "0.2",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.1",
            transform: "scale(1.01)",
          },
        },
        "portal-spin": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scale": "scale 0.3s ease-out",
        "gradient": "gradient 15s ease infinite",
        "pulse-slow": "pulse-slow 6s ease-in-out infinite",
        "pulse-slower": "pulse-slower 7s ease-in-out infinite",
        "pulse-slowest": "pulse-slowest 8s ease-in-out infinite",
        "portal-spin": "portal-spin 20s linear infinite",
      },
      backgroundImage: {
        'auth-pattern': 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
