/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Metal x Sunset Orange (Dark Theme)
        hub: {
          bg: '#1A1815',
          surface: '#2A2620',
          'surface-alt': '#221F1A',
          border: 'rgba(244,240,232,0.08)',
          'border-strong': 'rgba(244,240,232,0.15)',
          ink: '#F4F0E8',
          'ink-muted': '#8A7E6C',
          'ink-subtle': '#5C5448',
          accent: '#FF7A29',
          'accent-soft': 'rgba(255,122,41,0.12)',
          'accent-border': 'rgba(255,122,41,0.40)',
        },
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        'display': ['InterTight'],
        'body': ['InterTight'],
        'mono': ['JetBrainsMono'],
      },
      spacing: {
        '3.5': '14px',
        '4.5': '18px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '14px',
        '2xl': '16px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
