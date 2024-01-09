module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ['airbnb', 'plugin:react/recommended'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', 'jsx-a11y'],
    rules: {
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-indent': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  };
  