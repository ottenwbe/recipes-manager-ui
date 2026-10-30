import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules', 'build', '.next', 'coverage', 'public'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
  },
];
