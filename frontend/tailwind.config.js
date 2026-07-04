/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7BC9F5',       // Soft dreamy sky blue
        primaryHover: '#5AB8ED',
        surface: '#FFFFFF/90',    // Slightly transparent surface
        background: '#F0F9FF',    // Soft dreamy blueish-white background
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        borderLight: '#E0F2FE',
        avatarBg: '#FFECA1',      // Dreamy soft golden glow
        avatarText: '#A17200',    // Soft warm amber text
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
