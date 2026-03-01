/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme
        'light-bg': '#F3F4F6', // gray-100
        'light-calculator-bg': '#FFFFFF', // white
        'light-display-bg': '#E5E7EB', // gray-200
        'light-display-text': '#111827', // gray-900
        'light-key-bg': '#D1D5DB', // gray-300
        'light-key-text': '#111827', // gray-900
        'light-key-hover-bg': '#9CA3AF', // gray-400
        'light-operator-key-bg': '#FBBF24', // amber-400
        'light-operator-key-text': '#FFFFFF', // white
        'light-operator-key-hover-bg': '#F59E0B', // amber-500

        // Dark Theme
        'dark-bg': '#1F2937', // gray-800
        'dark-calculator-bg': '#374151', // gray-700
        'dark-display-bg': '#111827', // gray-900
        'dark-display-text': '#F9FAFB', // gray-50
        'dark-key-bg': '#4B5563', // gray-600
        'dark-key-text': '#F9FAFB', // gray-50
        'dark-key-hover-bg': '#6B7280', // gray-500
        'dark-operator-key-bg': '#F59E0B', // amber-500
        'dark-operator-key-text': '#FFFFFF', // white
        'dark-operator-key-hover-bg': '#D97706', // amber-600
      },
    },
  },
  plugins: [],
}
