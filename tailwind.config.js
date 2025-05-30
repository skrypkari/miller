/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#121318',
          card: '#1e1f25',
        },
        accent: {
          green: '#4ade80',
          red: '#ef4444',
          yellow: '#F3BA2F',
          blue: '#28A0F0',
          purple: '#8247E5',
        }
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};