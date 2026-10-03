/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primary-color":"#E83E8C",
        "secondary-color":"#EAF0F1"
      }
    },
  },
  plugins: [],
};
