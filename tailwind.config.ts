/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                '80s-black': 'var(--80s-black)',
                '80s-cyan': 'var(--80s-cyan)',
                '80s-green': 'var(--80s-green)',
                '80s-magenta': 'var(--80s-magenta)',
                '80s-pink': 'var(--80s-pink)',
                '80s-neon-pink': 'var(--80s-neon-pink)',
                '80s-purple': 'var(--80s-purple)',
                '80s-white': 'var(--80s-white)',
                '80s-yellow': 'var(--80s-yellow)',
                '80s-light-gray': 'var(--80s-light-gray)',
                '80s-dark-blue': 'var(--80s-dark-blue)',
                '80s-dark-gray': 'var(--80s-dark-gray)',
                'synth-bg': 'var(--synth-bg)',
                'synth-bg-mid': 'var(--synth-bg-mid)',
                'synth-surface': 'var(--synth-surface)',
                'synth-primary': 'var(--synth-primary)',
                'synth-secondary': 'var(--synth-secondary)',
                'synth-tertiary': 'var(--synth-tertiary)',
                'synth-accent': 'var(--synth-accent)',
                'synth-text': 'var(--synth-text)',
                'synth-text-muted': 'var(--synth-text-muted)',
            },
        },
    },
    plugins: [],
};
