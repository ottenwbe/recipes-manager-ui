const path = require('path');

const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['./jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  globals: { fetch, Response, Request },
  // Map module aliases used in vite.config.ts
  moduleNameMapper: {
    '^@components/(.*)$': path.resolve(__dirname, 'src/common/components/$1'),
    '^@context/(.*)$': path.resolve(__dirname, 'src/common/context/$1'),
    '^@public/(.*)$': path.resolve(__dirname, 'public/$1'),
  },
};

module.exports = customJestConfig;