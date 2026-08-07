/** Legacy Tailwind v3 config — tokens live in src/index.css (@theme). Kept for tooling that still reads this file. */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0B5F56',
        'brand-hover': '#094A43',
        'brand-muted': '#D8EBE7',
        primary: '#0B5F56',
        accent: '#E08A1E',
        'accent-hover': '#C47412',
        ink: '#1A1814',
        'ink-muted': '#5C574E',
        'ink-faint': '#8A8478',
        canvas: '#F3F1EC',
        surface: '#FFFDF9',
        'surface-2': '#EDEAE3',
        line: '#D9D4C8',
        success: '#1F7A4D',
        warning: '#B45309',
        danger: '#B42318',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        ui: '12px',
      },
      boxShadow: {
        1: '0 1px 2px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.04)',
        2: '0 4px 8px rgba(26,24,20,0.06), 0 16px 32px rgba(26,24,20,0.08)',
      },
    },
  },
  plugins: [],
};
