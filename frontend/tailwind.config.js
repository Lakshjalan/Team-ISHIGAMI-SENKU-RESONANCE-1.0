/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./ReconcileDashboard.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Libre Caslon Text"', 'serif'],
        sans: ['Geist', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
