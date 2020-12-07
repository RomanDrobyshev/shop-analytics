module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'airbnb-typescript/base',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-param-reassign': 'off',
    'max-classes-per-file': [0, 5, "exclude-class-expressions"],
    'no-console': ["error", { allow: ["info", "error", "dir"] }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"]
  },
};
