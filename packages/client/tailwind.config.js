/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {

    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {

        'plum': {
          '50': '#fef5fd',
          '100': '#fcebfa',
          '200': '#f8d6f4',
          '300': '#f1b6e7',
          '400': '#e88ad7',
          '500': '#d85dc0',
          '600': '#bc3da1',
          '700': '#9b3081',
          '800': '#892c72',
          '900': '#692657',
          '950': '#440e36',
      },
      


        'tolopea': {
          '50': 'hsl(257, 100%, 97%)',
          '100': 'hsl(261, 100%, 95%)',
          '200': 'hsl(260, 100%, 90%)',
          '300': 'hsl(263, 100%, 83%)',
          '400': 'hsl(265, 100%, 73%)',
          '500': 'hsl(268, 100%, 62%)',
          '600': 'hsl(271, 100%, 55%)',
          '700': 'hsl(271, 96%, 50%)',
          '800': 'hsl(271, 95%, 42%)',
          '900': 'hsl(271, 93%, 35%)',
          '950': 'hsl(269, 100%, 12%)',
        },  

        'gold': {
          '50': '#fefbe8',
          '100': '#fff8c2',
          '200': '#ffee89',
          '300': '#ffd72b',
          '400': '#fdc712',
          '500': '#ecad06',
          '600': '#cc8502',
          '700': '#a35d05',
          '800': '#86490d',
          '900': '#723c11',
          '950': '#431e05',
      },

      'lavender-magenta': {
          '50': '#fef1fb',
          '100': '#fee5f8',
          '200': '#ffcbf3',
          '300': '#ffa1e7',
          '400': '#ff80db',
          '500': '#fa3abe',
          '600': '#ea189e',
          '700': '#cc0a81',
          '800': '#a80c69',
          '900': '#8c0f59',
          '950': '#560133',
      },
      'fuchsia-blue': {
        '50': '#f5f4fe',
        '100': '#ecebfc',
        '200': '#dbd9fb',
        '300': '#c0baf8',
        '400': '#a093f2',
        '500': '#8067eb',
        '600': '#6f48e0',
        '700': '#5f35cc',
        '800': '#4f2cab',
        '900': '#43268c',
        '950': '#28165f',
    },
    
    
      
      

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}