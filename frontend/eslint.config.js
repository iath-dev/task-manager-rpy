import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import cypressPlugin from 'eslint-plugin-cypress'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    // Main configuration for React files
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig, // Must be last
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    parserOptions: {
      project: false,
    },
    rules: {
      // Essential Best Practices
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // Import Order Rules
      'react-refresh/only-export-components': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            // React imports first
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            // Alias imports (e.g., @/)
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'], // Exclude 'react' from other groups
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    // Configuration for Cypress test files
    files: ['cypress/**/*.{ts,tsx}', 'src/**/*.cy.{ts,tsx}'],
    plugins: {
      cypress: cypressPlugin,
    },
    extends: [cypressPlugin.configs.recommended],
    languageOptions: {
      globals: globals.merge(globals.browser, globals.cypress),
    },
  },
  {
    // Configuration for root-level config files
    files: ['*.ts', '*.js'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
