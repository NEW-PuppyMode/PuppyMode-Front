import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import prettierConfig from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import {defineConfig} from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {js},
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {globals: {...globals.browser, ...globals.node}},
  },
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.json'],
    plugins: {json},
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: {css},
    language: 'css/css',
    extends: ['css/recommended'],
  },
  prettierConfig,
]);
