import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['create-ts-app-starter/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['admin/**/*.{ts,tsx}', 'web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.config.{js,mjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
