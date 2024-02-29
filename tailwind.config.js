/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFFF",
        background: '#F5F5F5',
        orange: "#C87711",
        green: "#999933",
        yellow: "#FFC000",
      },
    },
  },
  plugins: [],
};
