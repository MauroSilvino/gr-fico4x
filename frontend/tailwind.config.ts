import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        Inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#298B3C',
        secondary: '#267a38',
        body: '#fafafa',
        background: '#e5e5e5',

        /* Black Mode */
        // body: '#1a1a1a',
        // background: '#1e1e1e',
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
