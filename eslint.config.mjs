import eslintConfig from 'eslint-config-next/core-web-vitals';

const config = [
  ...eslintConfig,
  {
    ignores: ['.pnp.cjs'],
  },
  {
    rules: {
      quotes: ['error', 'single'],
    },
  },
];

export default config;
