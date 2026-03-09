module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@ionic|@angular|@stencil|ionicons)/)',
  ],
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)'],
  moduleNameMapper: {
    '^ionicons/components/(.*)$': '<rootDir>/__mocks__/ionicons/components/$1',
  },
};