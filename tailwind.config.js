module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'sans': ['work-sans', 'Helvetica', 'sans-serif']
    },
    colors: {
      'blue': '#4263EB',
      'purple': '#7048E8',
      'pink': '#F784AD',
      'orange': '#D84910',
      'red': '#F03D3E',
      // 'green': '#13ce66',
      // 'yellow': '#ffc82c',
      'gray-1': '#F8F9FA',
      'gray-2': '#DDE2E5',
      'gray-3': '#ACB5BD',
      'gray-4': '#495057',
      'black': '#212429',
      'black-lite': '#41454B',
      'white': '#FFFFFF',
      'fuschia-60': '#FCDDEC'
    },
    extend: {
      spacing: {
        '2': '2px',
        'xxs': '3px',
        'xs': '6px',
        's': '8px',
        'm': '12px',
        'xm': '14px',
        'xxm': '18px',
        'l': '24px',
        'xl': '',
        'xxl': '',
        'btn': '32px',
        '50': '50px',
        '7/10': '70%'
      },
      fontSize:{
        'xs': '12px',
        's': '14px',
        'm': '16px',
        'l': '21px',
        'xl': '26px',
        'emoji-l': '60px'
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        flyin: {
          '0%': { transform: 'translateY(-50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        flyout: {
          '100%': { transform: 'translateY(0)', opacity: 1 },
          '0%': { transform: 'translateY(-50px)', opacity: 0 }
        }
      },
      animation: {
        flyin: 'flyin .3s ease-in-out',
        flyout: 'flyout .3s ease-out-in'
      }
    }

  },
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ['odd', 'even']
    }
  },
}
