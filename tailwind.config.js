/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        primary: '#697598',
        secondary: '#4F4F4F',
        generalBackground: '#F5F6FA',
        appBlue: '#003EFF',
        stroke: '#E3E6EF',
        primaryBlack: '#1F1F23',

        darkGray: '#373B47',
        lightGray: '#697598',
      },
      fontFamily: {
        sans: ['Work Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}