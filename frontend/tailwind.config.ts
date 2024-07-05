import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#298B3C',
        secondary: '#267a38',
        'body-light': '#fafafa',
        'background-light': '#e5e5e5',
        'body-dark': '#111827',
        'background-dark': '#1f2937',
      },
    },
    screens: {
      xs: '480px',
      // => @media (min-width: 480px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
}
export default config
