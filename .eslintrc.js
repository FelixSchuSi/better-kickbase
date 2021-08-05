// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  plugins: ['eslint-plugin-import', '@typescript-eslint'],
  ignorePatterns: '*.js',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'prettier'],
  rules: {
    '@typescript-eslint/typedef': [
      'warn',
      {
        arrowParameter: true,
        memberVariableDeclaration: true,
        objectDestructuring: true,
        parameter: true,
        propertyDeclaration: true,
        variableDeclaration: true,
        variableDeclarationIgnoreFunction: true
      }
    ],
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
};
