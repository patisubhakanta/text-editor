/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind will look for class names in all JS/TS files in the src directory
    "./public/index.html"         // Also include HTML files if you use Tailwind in them
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
