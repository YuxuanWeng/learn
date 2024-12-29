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
  rules: {
    '@typescript-eslint/prefer-string-starts-ends-with': 'off'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts']
      },
      alias: {
        map: [['@', path.resolve(__dirname, './src')]],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
