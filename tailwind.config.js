/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#FFFDF6', // Creamy Neobrutalism background
          dark: '#000000', // High contrast black
          work: '#FF5A5F', // Neo red-orange
          break: '#00E676', // Neo neon green
          accent: '#FFDE47', // Neo bright yellow
          custom: '#38BDF8', // Neo light blue
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-hover': '2px 2px 0px 0px #000000',
        'neo-lg': '8px 8px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [],
}
