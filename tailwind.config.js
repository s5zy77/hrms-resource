/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: '#8BA6B9',
        pastelBlueLight: '#C3D6E3',
        pastelBlueDark: '#5A7D92',
        softYellow: '#FEF9C3', // Light yellow for notes
        softYellowBorder: '#FDE047',
        textMain: '#475569',
        textMuted: '#94A3B8',
        bgWhite: '#F8FAFC',
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
