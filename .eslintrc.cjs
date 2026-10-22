module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.3' } },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
  },
}
