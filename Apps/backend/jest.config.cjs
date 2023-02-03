module.exports = {
    testEnvironment: 'jest-environment-node',
    testMatch: ['**/src/tests/**/*.spec.js'],
    collectCoverageFrom: ['**/src/**/*.js', '!**/node_modules/**', '!**/vendor/**']
  };