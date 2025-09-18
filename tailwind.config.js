/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 6px 18px rgba(20, 20, 50, 0.06)",
        card: "0 8px 24px rgba(22, 24, 49, 0.06)"
      },
      colors: {
        primary: { 500: "#6c63ff", 600: "#5a4ddb" },
        danger: "#dc2626",
        success: "#16a34a",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } }
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out"
      }
    }
  },
  plugins: [],
}