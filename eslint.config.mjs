import eslintConfig from 'eslint-config-next/core-web-vitals';
import perfectionist from 'eslint-plugin-perfectionist';

const config = [
  ...eslintConfig,
  {
    ignores: ['.pnp.cjs'],
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-intersection-types': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-object-types': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-objects': ['error', { order: 'asc', type: 'alphabetical' }],
      'perfectionist/sort-union-types': ['error', { order: 'asc', type: 'alphabetical' }],
      quotes: ['error', 'single'],
    },
  },
];

export default config;
