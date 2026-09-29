/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        railway: {
          dark: '#080d1a',
          card: '#0f172a',
          surface: '#131e36',
          border: '#1e293b',
          blue: {
            DEFAULT: '#0284c7',
            light: '#38bdf8',
            dark: '#0369a1',
            glow: '#0ea5e9',
          },
          orange: {
            DEFAULT: '#f97316',
            light: '#fb923c',
            dark: '#ea580c',
          },
          red: {
            DEFAULT: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
            signal: '#ff1e1e',
          },
          green: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          yellow: {
            DEFAULT: '#eab308',
            light: '#fde047',
            dark: '#ca8a04',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'train-progress': 'trainRide 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rail-shimmer': 'railShimmer 2.5s infinite linear',
        'beacon': 'beacon 1.8s infinite ease-in-out',
      },
      keyframes: {
        trainRide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(350%)' },
        },
        railShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        beacon: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
