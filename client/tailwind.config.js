/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1",        // Indigo
          dark: "#4F46E5",           // Deeper Indigo
          light: "#E0E7FF",          // Light Indigo
          accent: "#F59E0B",         // Amber Accent
          secondary: "#EC4899",      // Vibrant Pink
          highlight: "#10B981",      // Emerald
          muted: "#F9FAFB",          // Light Gray
        },
        neutral: {
          100: "#ffffff",
          200: "#f9fafb",
          300: "#f3f4f6",
          400: "#e5e7eb",
          500: "#d1d5db",
          600: "#9ca3af",
          700: "#6b7280",
          800: "#4b5563",
          900: "#1f2937",
        },
        glass: "rgba(255, 255, 255, 0.15)",
      },

      fontFamily: {
        body: ["'DM Sans'", "sans-serif"],
        heading: ["'Playfair Display'", "serif"],
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },

      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "4xl": "2.5rem",
        full: "9999px",
      },

      boxShadow: {
        soft: "0 4px 30px rgba(0, 0, 0, 0.05)",
        heavy: "0 8px 32px rgba(0, 0, 0, 0.15)",
        glass: "0 8px 32px rgba(31, 38, 135, 0.37)",
        glow: "0 0 10px rgba(99, 102, 241, 0.5)", // Indigo glow
      },

      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },

      screens: {
        '3xl': '1600px',
        '4xl': '1800px',
      },
      backgroundSize: {
        '300%': '300%',
      },

      keyframes: {
        updown: {
          "0%, 100%": { transform: "translateY(-12px)" },
          "50%": { transform: "translateY(12px)" },
        },
        pulsefast: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
        flicker: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        updown: "updown 4s ease-in-out infinite",
        bounce: "bounce 1.2s infinite ease-in-out",
        pulsefast: "pulsefast 1.5s ease-in-out infinite",
        flicker: "flicker 2s infinite",
        gradient: 'gradient 6s ease infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
