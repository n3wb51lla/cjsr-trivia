/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cjsr: {
          red: 'var(--color-cjsr-red)',
          'red-light': 'var(--color-cjsr-red-light)',
          black: 'var(--color-cjsr-black)',
          surface: 'var(--color-cjsr-surface)',
          ink: 'var(--color-cjsr-ink)',
          correct: 'var(--color-cjsr-correct)',
          yellow: 'var(--color-cjsr-yellow)',
          cyan: 'var(--color-cjsr-cyan)',
          paper: 'var(--color-cjsr-paper)',
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
