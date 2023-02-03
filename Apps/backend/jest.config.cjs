module.exports = {
    testEnvironment: 'jest-environment-node',
    testMatch: ['**/src/tests/**/*.spec.js'],
    collectCoverageFrom: ['**/src/**/*.js', '!**/node_modules/**', '!**/vendor/**'],
    "coverageThreshold": {
      "global": {
        "lines": 70,
        "statements": 70
      }
    }
  };