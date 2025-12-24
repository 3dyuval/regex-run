/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space-red': '#90393a',
        'space-yellow': '#ffff85',
        'space-sand': '#e2d1c3',
        'space-stone': '#434343',
      }
    },
  },
  plugins: [],
};
