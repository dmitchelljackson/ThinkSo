import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/ios/**', '**/android/**'],
  },
  eslint.configs.recommended,
  {
    files: ['apps/mobile/**/*.{js,jsx,ts,tsx}', 'packages/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    rules: {
      'no-console': 'warn',
    },
  },
  prettier,
];
