/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/**/*.{js,jsx,ts,tsx}',
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the app folder
    './components/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the components folder]
    './app/(tabs)/meditate.tsx',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rmono: ['Roboto-Mono', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
