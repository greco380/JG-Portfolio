/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#4f46e5",
        accent: "#7c3aed",
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'gradient-y': 'gradient-y 5s ease infinite',
        'gradient-xy': 'gradient-xy 5s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right bottom'
          }
        }
      },
    },
  },
  plugins: [],
} 