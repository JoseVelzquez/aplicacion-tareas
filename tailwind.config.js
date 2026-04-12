/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 23, 42, 0.12)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.12) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(14, 165, 233, 0.12) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(236, 72, 153, 0.15) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(14, 165, 233, 0.12) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};
