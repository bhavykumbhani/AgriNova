/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          primary: '#149966',
          dark: '#087451',
          teal: '#0E9F8A',
          textDark: '#10233F',
          textSecondary: '#5F6F7F',
          bg: '#F7FAF9',
          softGreen: '#EAF8F2',
          softBlue: '#EDF7FC',
          orange: '#F5A623',
          danger: '#E74C3C',
          success: '#23A455',
          border: '#E3ECE7',
          card: '#FFFFFF',
          // Dark Mode Tokens (per Phase 3 spec)
          darkBg: '#071A16',
          darkBgSecondary: '#0D241E',
          darkCard: '#112D25',
          darkBorder: '#21453A',
          darkPrimary: '#27C58B',
          darkAccent: '#63DBAE',
          darkText: '#F3FAF7',
          darkTextSecondary: '#A8C2B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Gujarati', 'Shruti', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 4px 20px -2px rgba(16, 35, 63, 0.05), 0 2px 6px -1px rgba(16, 35, 63, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(20, 153, 102, 0.12), 0 4px 10px -2px rgba(16, 35, 63, 0.04)',
        'nav': '0 2px 14px -2px rgba(16, 35, 63, 0.06)',
      },
      borderRadius: {
        'card': '16px',
      }
    },
  },
  plugins: [],
}
