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
                // Added theme colors from globals.css for prose
                'background': 'var(--background)',
                'foreground': 'var(--foreground)',
                'secondary-bg': 'var(--secondary-bg)',
            },
            typography: ({ theme }) => ({
                synthwave: { // Custom theme name
                  css: {
                    '--tw-prose-body': theme('colors.foreground'),
                    '--tw-prose-headings': theme('colors.80s-cyan'),
                    '--tw-prose-lead': theme('colors.80s-pink'),
                    '--tw-prose-links': theme('colors.80s-pink'),
                    '--tw-prose-bold': theme('colors.80s-white'),
                    '--tw-prose-counters': theme('colors.80s-purple'),
                    '--tw-prose-bullets': theme('colors.80s-magenta'),
                    '--tw-prose-hr': theme('colors.80s-magenta'),
                    '--tw-prose-quotes': theme('colors.80s-purple'),
                    '--tw-prose-quote-borders': theme('colors.80s-magenta'),
                    '--tw-prose-captions': theme('colors.foreground'),
                    '--tw-prose-code': theme('colors.80s-green'),
                    '--tw-prose-pre-code': theme('colors.80s-green'),
                    '--tw-prose-pre-bg': theme('colors.80s-black'),
                    '--tw-prose-th-borders': theme('colors.80s-magenta'),
                    '--tw-prose-td-borders': theme('colors.80s-purple'),
                    h1: {
                      color: theme('colors.80s-cyan'),
                      textShadow: `0 0 4px ${theme('colors.80s-cyan')}, 0 0 8px ${theme('colors.80s-cyan')}`,
                    },
                    h2: {
                      color: theme('colors.80s-cyan'),
                      textShadow: `0 0 4px ${theme('colors.80s-cyan')}, 0 0 8px ${theme('colors.80s-cyan')}`,
                    },
                    h3: {
                      color: theme('colors.80s-cyan'),
                      textShadow: `0 0 4px ${theme('colors.80s-cyan')}, 0 0 8px ${theme('colors.80s-cyan')}`,
                    },
                    h4: {
                      color: theme('colors.80s-cyan'),
                      textShadow: `0 0 4px ${theme('colors.80s-cyan')}, 0 0 8px ${theme('colors.80s-cyan')}`,
                    },
                    h5: {
                      color: theme('colors.80s-cyan'),
                      textShadow: `0 0 4px ${theme('colors.80s-cyan')}, 0 0 8px ${theme('colors.80s-cyan')}`,
                    },
                    h6: {
                      color: theme('colors.80s-cyan'),
                      textShadow: `0 0 4px ${theme('colors.80s-cyan')}, 0 0 8px ${theme('colors.80s-cyan')}`,
                    },
                    a: {
                      color: theme('colors.80s-pink'),
                      textShadow: `0 0 4px ${theme('colors.80s-pink')}`,
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme('colors.80s-white'),
                        textShadow: `0 0 6px ${theme('colors.80s-pink')}, 0 0 10px ${theme('colors.80s-pink')}`,
                      },
                    },
                    code: {
                      color: theme('colors.80s-green'),
                      backgroundColor: theme('colors.secondary-bg'),
                      padding: '0.2em 0.4em',
                      borderRadius: '0.25rem',
                      fontWeight: '600',
                      textShadow: `0 0 3px ${theme('colors.80s-green')}`, // Added glow to inline code
                    },
                    'code::before': { content: 'none' },
                    'code::after': { content: 'none' },
                    pre: {
                      backgroundColor: theme('colors.80s-black'),
                      color: theme('colors.80s-green'),
                      padding: '1rem', // Used 1rem for padding like theme('spacing.4')
                      borderRadius: '0.375rem', // Used 0.375rem for border radius like theme('spacing.md')
                      overflowX: 'auto',
                      border: `1px solid ${theme('colors.80s-magenta')}`, // Added border
                      boxShadow: `0 0 8px ${theme('colors.80s-magenta')}`, // Added glow
                    },
                  },
                },
              }),
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
