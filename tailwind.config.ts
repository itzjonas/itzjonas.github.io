/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                '80s-black': 'var(--80s-black)',
                '80s-cyan': 'var(--80s-cyan)',
                '80s-green': 'var(--80s-green)',
                '80s-magenta': 'var(--80s-magenta)',
                '80s-pink': 'var(--80s-pink)',
                '80s-purple': 'var(--80s-purple)',
                '80s-white': 'var(--80s-white)',
                '80s-yellow': 'var(--80s-yellow)',
            },
        },
    },
    plugins: [],
};
