const path = require('path');

const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['./jest.setup.js'],
  // Map module aliases used by Vite and TypeScript
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  globals: { fetch, Response, Request },
  // Map module aliases used in vite.config.mjs
  moduleNameMapper: {
    '^@components/(.*)$': path.resolve(__dirname, 'src/common/components/$1'),
    '^@context/(.*)$': path.resolve(__dirname, 'src/common/context/$1'),
    '^@public/(.*)$': path.resolve(__dirname, 'public/$1'),
    '.(svg|ico|jpg|jpeg|png|gif)$': path.resolve(__dirname, 'test/mocks/fileMock.js'),
  },
};

module.exports = customJestConfig;