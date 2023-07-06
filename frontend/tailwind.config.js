/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [require('flowbite/plugin')],
}

