/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coffee-inspired earth tones
        espresso: {
          50: '#f8f6f4',
          100: '#ede7e2',
          200: '#d9cfc6',
          300: '#bfb0a1',
          400: '#a08974',
          500: '#8a6d57',
          600: '#6f5242',
          700: '#5a4236',
          800: '#4a362e',
          900: '#3d2d26',
          950: '#1f1713',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#faefdc',
          300: '#f5e1c3',
          400: '#efcd9f',
          500: '#e8b578',
          600: '#de9a4e',
          700: '#d07d2e',
          800: '#ad6222',
          900: '#8d4c1e',
          950: '#51280b',
        },
        amber: {
          light: '#f5c542',
          DEFAULT: '#d4a017',
          dark: '#b8860b',
        },
        charcoal: {
          light: '#4a4a4a',
          DEFAULT: '#2d2d2d',
          dark: '#1a1a1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
