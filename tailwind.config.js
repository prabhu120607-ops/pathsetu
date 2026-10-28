/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F5F7F2',
          surface: '#FFFFFF',
          primary: '#234B3D',
          'primary-hover': '#1B3B30',
          'primary-light': '#E9F1EC',
          secondary: '#B9C9B3',
          'secondary-light': '#E4EBDD',
          dark: '#162820',
          muted: '#5A6E63',
          border: '#DDE5DA',
          borderLight: '#EDF2EC',
          accent: '#3B7A63',
          warning: '#D97706',
          success: '#15803D',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(35, 75, 61, 0.05), 0 1px 2px rgba(35, 75, 61, 0.03)',
        'card': '0 4px 14px rgba(35, 75, 61, 0.06)',
        'card-hover': '0 10px 24px rgba(35, 75, 61, 0.1)',
        'modal': '0 20px 40px rgba(22, 40, 32, 0.18)',
      },
      borderRadius: {
        'brand': '14px',
        'brand-sm': '10px',
        'brand-lg': '20px',
      }
    },
  },
  plugins: [],
}
