import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian Vanguard Dark Palette
        background: '#131313',
        surface: {
          DEFAULT: '#131313',
          dim: '#131313',
          bright: '#3a3939',
          variant: '#353534',
          tint: '#c6c6c7',
          container: {
            lowest: '#0e0e0e',
            low: '#1c1b1b',
            DEFAULT: '#201f1f',
            high: '#2a2a2a',
            highest: '#353534',
          },
        },
        'on-surface': {
          DEFAULT: '#e5e2e1',
          variant: '#c4c7c8',
        },
        'on-background': '#e5e2e1',
        primary: {
          DEFAULT: '#ffffff',
          container: '#e2e2e2',
          fixed: '#e2e2e2',
          'fixed-dim': '#c6c6c7',
        },
        'on-primary': {
          DEFAULT: '#2f3131',
          container: '#636565',
          fixed: '#1a1c1c',
          'fixed-variant': '#454747',
        },
        secondary: {
          DEFAULT: '#c7c6c6',
          container: '#464747',
          fixed: '#e3e2e2',
          'fixed-dim': '#c7c6c6',
        },
        'on-secondary': {
          DEFAULT: '#303031',
          container: '#b8b8b8',
          fixed: '#1a1c1c',
          'fixed-variant': '#464747',
        },
        tertiary: {
          DEFAULT: '#ffffff',
          container: '#e5e2e1',
          fixed: '#e2e2e2',
          'fixed-dim': '#c8c6c5',
        },
        'on-tertiary': {
          DEFAULT: '#2f3131',
          container: '#656464',
          fixed: '#1c1b1b',
          'fixed-variant': '#474746',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        'on-error': {
          DEFAULT: '#690005',
          container: '#ffdad6',
        },
        outline: {
          DEFAULT: '#8e9192',
          variant: '#444748',
        },
        inverse: {
          surface: '#e5e2e1',
          'on-surface': '#313030',
          primary: '#5d5f5f',
        },
      },
      fontFamily: {
        display: ['Libre Caslon Text', 'serif'],
        headline: ['Libre Caslon Text', 'serif'],
        body: ['Geist', 'sans-serif'],
        label: ['Geist', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      spacing: {
        gutter: '20px',
        'container-max': '1280px',
        unit: '8px',
        'margin-mobile': '16px',
        'margin-desktop': '48px',
      },
    },
  },
  plugins: [],
};

export default config;
