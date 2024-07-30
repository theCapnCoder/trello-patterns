import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-console': ['warn'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'max-params': ['error', 3],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1
        }
      ],
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true
          },
          AssignmentExpression: {
            array: true,
            object: false
          }
        },
        {
          enforceForRenamedProperties: false
        }
      ]
    }
  }
];
