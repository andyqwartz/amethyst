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
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scale": "scale 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;