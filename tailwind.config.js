/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        White: "#FFFFFF",
        Background: '#F5F5F5',
        Orange: "#C87711",
        Green: "#999933",
        Yellow: "#FFC000",
      },
    },
  },
  plugins: [],
};
