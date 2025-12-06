/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'disaster-red': '#ef4444',
        'safe-green': '#22c55e',
        'warning-yellow': '#eab308',
        'dark-bg': '#0f172a',
        'panel-bg': '#1e293b',
      },
    },
  },
  plugins: [],
}
