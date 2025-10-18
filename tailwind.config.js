/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your 8% Orange Accent
        "zavo-orange": "#ff7a00", 
        // Your 77% Black Backgrounds
        "zavo-bg": "#0b0b0b",      // Main background
        "zavo-card": "#0f0f0f",    // Card background
        "zavo-border": "#171717",  // Borders
        // Your 15% White/Muted Text
        "zavo-text": "#e9e9e9",
        "zavo-muted": "#a7adb2",
      }
    },
  },
  plugins: [],
}
