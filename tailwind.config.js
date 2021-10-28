module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blue: {
        light: '#BBE1FA',
        DEFAULT: '#3282B8',
        dark: '#0F4C75',
      },
      dark: {
        DEFAULT: '#1B262C',
      },
      bright: {
        DEFAULT: '#fff',
      },
      red: {
        DEFAULT: '#FF4136',
      },
      green: {
        DEFAULT: '#2ECC40',
      },
      extend: {},
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
