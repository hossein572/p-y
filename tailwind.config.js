/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#F5FAFD',
        primary: {
          DEFAULT: '#74B9E8',
          600: '#5BA7D6',
          700: '#3178AC',
          deep: '#174A6B',
          soft: '#C4E5F7',
          light: '#DDF1FC',
          faint: '#EDF6FC',
        },
        ink: {
          DEFAULT: '#14212B',
          soft: '#667783',
          faint: '#94A4AF',
        },
        line: '#DCEAF2',
        success: '#3AA981',
        'success-soft': '#E4F4EE',
        danger: '#D95C5C',
        'danger-soft': '#FBEAEA',
        warn: '#DFA13A',
        'warn-soft': '#FBF1DD',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 74, 107, 0.05)',
        'card-hover': '0 8px 24px -8px rgba(23, 74, 107, 0.14)',
        sheet: '0 -12px 40px -12px rgba(23, 74, 107, 0.22)',
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        '2.5': '0.625rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.3s ease both',
        'sheet-up': 'sheet-up 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
