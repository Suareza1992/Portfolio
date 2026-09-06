/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that can contain a class name. main.js builds tech-stack chips
  // and scroll hints at runtime, so it has to be scanned too.
  content: ['./index.html', './main.js'],
  theme: {
    extend: {},
  },
  plugins: [],
};
