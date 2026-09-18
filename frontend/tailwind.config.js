/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B1E3F', // Maroon
          dark: '#64152E',    // Dark Maroon
          light: '#F8E9EE',   // Light Maroon tint
          hover: '#731834',
        },
        fin: {
          bg: '#F7F7F8',
          card: '#FFFFFF',
          text: '#242424',
          muted: '#6B6B6B',
          border: '#E5E5E5',
          borderLight: '#F0F0F0',
          success: '#218739',
          successLight: '#EAF5EC',
          warning: '#C88719',
          warningLight: '#FDF6E9',
          danger: '#C62828',
          dangerLight: '#FCE8E8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
      }
    },
  },
  plugins: [],
}
