// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // bật dark mode tự động
  theme: {
    extend: {
      // 1. Keyframes cho 3 chấm nhảy
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      // 2. Animation + delay
      animation: {
        bounce: "bounce 1.4s ease-in-out infinite",
      },
      // 3. Delay tùy chỉnh
      animationDelay: {
        150: "150ms",
        300: "300ms",
      },
    },
  },
  plugins: [
    // 4. Tạo class delay cho Tailwind
    function ({ addUtilities }) {
      addUtilities({
        ".animate-delay-150": { "animation-delay": "150ms" },
        ".animate-delay-300": { "animation-delay": "300ms" },
      });
    },
  ],
};