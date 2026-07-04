/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: '#38BDF8', // Vibrant Sky Blue
        pastelBlueLight: '#BAE6FD', // Light sky glow
        pastelBlueDark: '#0284C7', // Deep sky blue for text
        softYellow: '#FEF08A', // Glowing yellow
        softYellowBorder: '#FACC15',
        textMain: '#0F172A',
        textMuted: '#64748B',
        bgWhite: '#F0F9FF', // Very light blue tint background
        cardWhite: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
