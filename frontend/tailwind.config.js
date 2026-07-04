/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',       // Clean, professional blue
        primaryHover: '#1D4ED8',
        surface: '#FFFFFF',
        background: '#F8FAFC',    // Subtle slate background
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        borderLight: '#E2E8F0',
        avatarBg: '#FEF08A',      // Light yellow as requested
        avatarText: '#854D0E',    // Dark yellow/brown for contrast
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
