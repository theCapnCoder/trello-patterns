import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-console': ['warn'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'prefer-destructuring': ['error'],
      'object-shorthand': ['error'],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowTypedFunctionExpressions: true }
      ],
      '@typescript-eslint/explicit-member-accessibility': ['error'],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true }
      ],
      '@typescript-eslint/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: '*',
          prev: ['block-like', 'return', 'type']
        }
      ]
    }
  }
];
