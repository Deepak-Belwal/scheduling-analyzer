import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
 
  dir: './',
});

const config: Config = {
  clearMocks: true,

  coverageProvider: 'v8',

  globals: {
    'ts-jest': {
      tsconfig: {
        rootDir: '.',
      },
    },
  },
  
  roots: ['<rootDir>/src'],

  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default createJestConfig(config);
