/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/react-daisyui/dist/**/*.js" // Ensure DaisyUI components are included
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
