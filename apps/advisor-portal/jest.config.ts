module.exports = {
  displayName: 'advisor-portal',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'html', 'mjs'],
  coverageDirectory: '../../coverage/apps/advisor-portal',
  transformIgnorePatterns: ['node_modules/(?!(@angular|rxjs)/)'],
  moduleNameMapper: {
    '^@org/(.*)$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@angular/core/testing$': '<rootDir>/../../node_modules/@angular/core/fesm2022/testing.mjs',
    '^@angular/core$': '<rootDir>/../../node_modules/@angular/core/fesm2022/core.mjs',
    '^@angular/common$': '<rootDir>/../../node_modules/@angular/common/fesm2022/common.mjs',
    '^@angular/common/http$': '<rootDir>/../../node_modules/@angular/common/fesm2022/http.mjs',
    '^@angular/compiler$': '<rootDir>/../../node_modules/@angular/compiler/fesm2022/compiler.mjs',
    '^@angular/platform-browser$': '<rootDir>/../../node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs',
    '^@angular/platform-browser/testing$': '<rootDir>/../../node_modules/@angular/platform-browser/fesm2022/testing.mjs',
    '^@angular/platform-browser-dynamic$': '<rootDir>/../../node_modules/@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs',
    '^@angular/platform-browser-dynamic/testing$': '<rootDir>/../../node_modules/@angular/platform-browser-dynamic/fesm2022/testing.mjs',
    '^@angular/forms$': '<rootDir>/../../node_modules/@angular/forms/fesm2022/forms.mjs',
    '^@angular/router$': '<rootDir>/../../node_modules/@angular/router/fesm2022/router.mjs',
  },
  // app.spec.ts relies on the Vitest/analogjs setup (DOM + vitest-angular);
  // it continues to run via the inferred vitest target.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/app/app.spec.ts'],
};
