module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
        colors: {
        paper: "#fefaf5",
        ink: "#17172d",

        orangeLight: "#da410f",
        orangeDark: "#e16731",

        purpleLight: "#5c5ab3",
        purpleDark: "#7a78ee",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: { 
        marquee: "marquee 18s linear infinite",
      },
    },
  },
  plugins: [],
};