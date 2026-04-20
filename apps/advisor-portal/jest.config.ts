module.exports = {
  displayName: 'advisor-portal',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.jest.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/advisor-portal',
  // app.spec.ts relies on the Vitest/analogjs setup (DOM + vitest-angular);
  // it continues to run via the inferred vitest target.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/app/app.spec.ts'],
};
