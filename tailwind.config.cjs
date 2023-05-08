/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      custom: ["Poppins", "sans-serif", "ui-sans-serif", "system-ui"],
    },
    extend: {
      colors: {
        primary: {
          200: "#FFFAF6",
          300: "#FFCA0F",
          400: "#F1965B",
          500: "#F97561",
          DEFAULT: "#F97561",
        },
        gray: {
          300: "#F2F0EF",
          400: "#D0CCCC",
          500: "#817D7D",
          600: "#493D3C",
          700: "#2C2524",
          DEFAULT: "#D0CCCC",
        },
        secondary: {
          200: "#EEFCFF",
          400: "#4195AF",
          DEFAULT: "#4195AF",
        },
      },
      fontSize: {
        "2xl": "3rem",
        xl: "2rem",
        lg: "1.5rem",
        md: "1.25rem",
        base: "1.125rem",
        DEFAULT: "1.125rem",
      },
      borderRadius: {
        md: "10px",
        lg: "20px",
      },
      animation: {
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) ",
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
