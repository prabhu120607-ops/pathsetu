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
        brand: {
          bg: 'var(--bg-page)',
          surface: 'var(--bg-card)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-surface)',
          primary: '#2563EB',
          'primary-hover': 'var(--primary-blue-hover)',
          'primary-light': 'var(--bg-surface)',
          secondary: '#06B6D4',
          'secondary-light': 'var(--bg-surface)',
          dark: 'var(--text-main)',
          muted: 'var(--text-secondary)',
          border: 'var(--border-color)',
          borderLight: 'var(--border-light)',
          accent: '#06B6D4',
          cyan: '#06B6D4',
          violet: '#7C3AED',
          white: '#FFFFFF',
          black: '#101318',
          warning: '#F59E0B',
          success: '#10B981',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': 'none',
        'card': 'none',
        'card-hover': 'none',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'brand': '12px',
        'brand-sm': '8px',
        'brand-lg': '16px',
      }
    },
  },
  plugins: [],
}
