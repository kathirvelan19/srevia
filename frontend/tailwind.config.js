/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        srevia: {
          bg: '#FCFBF7',
          primary: '#315C45',
          deep: '#1F3D2E',
          sage: '#A8B9A3',
          ivory: '#F4F0E7',
          charcoal: '#242824',
          gold: '#B89B5E',
          goldLight: '#D4AF37',
          accent: '#4F7C61',
          lightSage: '#EBF0E9',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'herbal': '0 10px 30px -10px rgba(31, 61, 46, 0.08)',
        'herbal-hover': '0 20px 40px -15px rgba(31, 61, 46, 0.15)',
        'gold-glow': '0 4px 20px -2px rgba(184, 155, 94, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 61, 46, 0.06)',
      }
    },
  },
  plugins: [],
}
