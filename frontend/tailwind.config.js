/** Legacy Tailwind v3 config — tokens live in src/index.css (@theme + data-theme). */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4F46E5',
        'brand-hover': '#4338CA',
        'brand-muted': '#E0E7FF',
        primary: '#4F46E5',
        violet: '#7C3AED',
        accent: '#06B6D4',
        'accent-hover': '#0891B2',
        ink: '#0F172A',
        'ink-muted': '#64748B',
        'ink-faint': '#94A3B8',
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-2': '#F1F5F9',
        line: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        ui: '12px',
      },
      boxShadow: {
        1: '0 1px 2px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)',
        2: '0 4px 8px rgba(15,23,42,0.06), 0 16px 32px rgba(15,23,42,0.08)',
      },
    },
  },
  plugins: [],
};
