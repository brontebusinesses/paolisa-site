/** @type {import('tailwindcss').Config} */
// PAOLISA design tokens — strictly aligned with PAOLISA_design_build_spec_v1.md §2.
// Any change to colours, type scale or spacing must be agreed before edits.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FFFFFF',
          secondary: '#FAFAF8',
          tertiary: '#F4F4F0',
          dark: '#18181B',
        },
        ink: {
          primary: '#18181B',
          secondary: '#4A4A48',
          tertiary: '#6B6B68',
          inverse: '#FAFAF8',
        },
        line: {
          subtle: '#DDDDDA',
          faint: '#E8E8E5',
        },
        // Conservé comme token mais plus utilisé sur le site (point ● désormais noir).
        terracotta: '#A85A35',
      },
      fontFamily: {
        // §2.2 (révisé juillet 2026) — Raleway pour le wordmark (aligné packaging),
        // Inter pour le reste, JetBrains Mono pour les labels techniques.
        wordmark: ['Raleway', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-l': ['1.625rem', { lineHeight: '1.15', letterSpacing: '-0.018em', fontWeight: '500' }],
        'display-l-mobile': ['1.375rem', { lineHeight: '1.2', letterSpacing: '-0.018em', fontWeight: '500' }],
        'display-m': ['1.375rem', { lineHeight: '1.2', letterSpacing: '-0.012em', fontWeight: '500' }],
        'display-m-mobile': ['1.125rem', { lineHeight: '1.25', letterSpacing: '-0.012em', fontWeight: '500' }],
        'display-s': ['1.0625rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-s-mobile': ['0.9375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-l': ['0.9375rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }],
        'body-l-mobile': ['0.875rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }],
        'body-m': ['0.8125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-m-mobile': ['0.75rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '400' }],
        'caption-mobile': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '400' }],
        'mono-label': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.18em', fontWeight: '400' }],
        'mono-label-mobile': ['0.59375rem', { lineHeight: '1.5', letterSpacing: '0.18em', fontWeight: '400' }],
        'mono-micro': ['0.59375rem', { lineHeight: '1.5', letterSpacing: '0.22em', fontWeight: '400' }],
        'mono-micro-mobile': ['0.5625rem', { lineHeight: '1.5', letterSpacing: '0.22em', fontWeight: '400' }],
      },
      spacing: {},
      maxWidth: {
        content: '1200px',
        manifesto: '480px',
        prose: '680px',
      },
      borderWidth: {
        DEFAULT: '0.5px',
        '0': '0',
        'hairline': '0.5px',
        '1': '1px',
      },
      borderRadius: {
        none: '0',
        arch: '200px 200px 4px 4px',
      },
      transitionDuration: {
        'ui-fast': '150ms',
        'ui': '200ms',
      },
      letterSpacing: {
        'tight-display': '-0.018em',
        'tight-m': '-0.012em',
        'tight-s': '-0.01em',
        'caption': '0.05em',
        'mono': '0.18em',
        'mono-wide': '0.22em',
        'wordmark': '0.2em',
      },
    },
  },
  plugins: [],
};
