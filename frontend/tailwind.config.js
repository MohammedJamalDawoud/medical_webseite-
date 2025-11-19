/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e', // Teal-700, similar to medical/scientific themes
        secondary: '#0e7490', // Cyan-700
      }
    },
  },
  plugins: [],
}
