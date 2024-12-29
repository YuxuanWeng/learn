const path = require('path');

module.exports = {
  root: true,
  extends: ['@fepkg/eslint-config-base', '@fepkg/eslint-config-react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname
  },
  plugins: ['import'],
  rules: {},
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts']
      },
      alias: {
        map: [
          ['@', path.resolve(__dirname, './src')],
          ['app', path.resolve(__dirname, './electron')],
          ['@packages', path.resolve(__dirname, './packages')]
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    'import/core-modules': ['electron']
  }
};
