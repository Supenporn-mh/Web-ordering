/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#95D1D4',
          main: '#228085',
          dark: '#1a6468',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontSize: {
        'xs': '14px',
        'sm': '16px',
        'base': '16px',
        'lg': '18px',
        'xl': '18px',
        '2xl': '18px',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
