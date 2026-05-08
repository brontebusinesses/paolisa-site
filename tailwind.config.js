/** @type {import('tailwindcss').Config} */
// PAOLISA design tokens — strictly aligned with PAOLISA_design_build_spec_v1.md §2.
// Any change to colours, type scale or spacing must be agreed before edits.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Extend the default theme with brand tokens. We keep the default scale
    // available so utilities like `text-base` etc. still work, but the brand
    // tokens below are the only ones that should be used in design.
    extend: {
      colors: {
        // §2.1 Palette — exclusive list, no other colour allowed on the site.
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
        // Reserved for the wordmark dot only. Never apply elsewhere.
        terracotta: '#A85A35',
      },
      fontFamily: {
        // §2.2 — Cormorant Garamond pour le wordmark, Inter pour le reste,
        // JetBrains Mono pour les labels techniques.
        wordmark: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // §2.2 — échelle typographique (mobile / desktop, en px → rem).
        // Each entry: [size, { lineHeight, letterSpacing, fontWeight }]
        'display-l': ['1.625rem', { lineHeight: '1.15', letterSpacing: '-0.018em', fontWeight: '500' }], // 26px
        'display-l-mobile': ['1.375rem', { lineHeight: '1.2', letterSpacing: '-0.018em', fontWeight: '500' }], // 22px
        'display-m': ['1.375rem', { lineHeight: '1.2', letterSpacing: '-0.012em', fontWeight: '500' }], // 22px
        'display-m-mobile': ['1.125rem', { lineHeight: '1.25', letterSpacing: '-0.012em', fontWeight: '500' }], // 18px
        'display-s': ['1.0625rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '500' }], // 17px
        'display-s-mobile': ['0.9375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }], // 15px
        'body-l': ['0.9375rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }], // 15px
        'body-l-mobile': ['0.875rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }], // 14px
        'body-m': ['0.8125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }], // 13px
        'body-m-mobile': ['0.75rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }], // 12px
        caption: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '400' }], // 12px
        'caption-mobile': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '400' }], // 11px
        'mono-label': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.18em', fontWeight: '400' }], // 10px
        'mono-label-mobile': ['0.59375rem', { lineHeight: '1.5', letterSpacing: '0.18em', fontWeight: '400' }], // 9.5px
        'mono-micro': ['0.59375rem', { lineHeight: '1.5', letterSpacing: '0.22em', fontWeight: '400' }], // 9.5px
        'mono-micro-mobile': ['0.5625rem', { lineHeight: '1.5', letterSpacing: '0.22em', fontWeight: '400' }], // 9px
      },
      spacing: {
        // §2.3 — échelle d'espacement (rem) : 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8.
        // Tailwind's defaults already cover these (2, 3, 4, 6, 8, 12, 16, 24, 32 in 0.25rem units).
        // We keep defaults; design uses the listed steps explicitly.
      },
      maxWidth: {
        // §2.3 — largeur max contenu : 1200px.
        content: '1200px',
        manifesto: '480px',
        prose: '680px',
      },
      borderWidth: {
        // §2.4 — bordures 0.5px par défaut.
        DEFAULT: '0.5px',
        '0': '0',
        'hairline': '0.5px',
        '1': '1px',
      },
      borderRadius: {
        // §2.4 — coins droits partout sauf cartes voûtées.
        none: '0',
        arch: '200px 200px 4px 4px',
      },
      transitionDuration: {
        // §2.5 — transitions UI seulement.
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
      },
    },
  },
  plugins: [],
};
