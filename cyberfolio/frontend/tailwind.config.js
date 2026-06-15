/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#00ff88',
          'green-dark': '#00cc6a',
          blue: '#00d4ff',
          'blue-dark': '#0099cc',
          purple: '#a855f7',
          'purple-dark': '#7c3aed',
          red: '#ff0040',
          yellow: '#f59e0b',
          dark: '#050a0f',
          'dark-2': '#0a1628',
          'dark-3': '#0f2040',
          'dark-4': '#1a2f50',
          card: 'rgba(10, 22, 40, 0.8)',
          border: 'rgba(0, 255, 136, 0.2)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out infinite',
        'type': 'typing 2s steps(20) forwards',
        'blink': 'blink 1s step-end infinite',
        'matrix': 'matrixRain 10s linear infinite',
        'particle-drift': 'particleDrift 8s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,136,0.3), 0 0 20px rgba(0,255,136,0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,136,0.6), 0 0 60px rgba(0,255,136,0.3)' }
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' }
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        particleDrift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)',
        'glow-radial': 'radial-gradient(circle at 50% 50%, rgba(0,255,136,0.1) 0%, transparent 70%)',
        'cyber-gradient': 'linear-gradient(135deg, #050a0f 0%, #0a1628 50%, #0f2040 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,212,255,0.03) 100%)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0,255,136,0.3)',
        'cyber-lg': '0 0 40px rgba(0,255,136,0.4)',
        'cyber-blue': '0 0 20px rgba(0,212,255,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.5)',
        'glow': '0 0 30px rgba(0,255,136,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}
