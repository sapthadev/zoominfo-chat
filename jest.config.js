module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        "\\.(css)$": "jest-css-modules-transform"
    },
    testEnvironment: 'jest-environment-jsdom',
  };