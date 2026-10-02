/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^firebase/app$': '<rootDir>/src/test/firebase-app-mock.ts',
    '^firebase/auth$': '<rootDir>/src/test/firebase-auth-mock.ts',
  },
};
