/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
        },
        sidebar: {
          DEFAULT: '#0F172A',
          hover: '#1E293B',
        },
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
      }
    },
  },
  plugins: [],
}

