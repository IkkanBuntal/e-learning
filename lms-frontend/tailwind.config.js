/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002B5B',
          50: '#E6EDF5',
          100: '#CCDAEB',
          200: '#99B5D7',
          300: '#6690C3',
          400: '#336BAF',
          500: '#002B5B',
          600: '#002249',
          700: '#001A37',
          800: '#001125',
          900: '#000913',
        },
        secondary: {
          DEFAULT: '#0056A3',
          50: '#E6F0F9',
          100: '#CCE1F3',
          200: '#99C3E7',
          300: '#66A5DB',
          400: '#3387CF',
          500: '#0056A3',
          600: '#004582',
          700: '#003461',
          800: '#002341',
          900: '#001220',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
