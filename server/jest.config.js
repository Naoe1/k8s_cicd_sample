export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "utils/**/*.js",
    "controllers/**/*.js",
    "routes/**/*.js",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
};
