/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: 'var(--color-brand-red)',
          'red-light': 'var(--color-brand-red-light)',
          black: 'var(--color-brand-black)',
          surface: 'var(--color-brand-surface)',
          ink: 'var(--color-brand-ink)',
          correct: 'var(--color-brand-correct)',
          yellow: 'var(--color-brand-yellow)',
          cyan: 'var(--color-brand-cyan)',
          paper: 'var(--color-brand-paper)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
