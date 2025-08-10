export default {
  testEnvironment: "node",
  maxWorkers: 1,
  testEnvironmentOptions: {},
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transform: {},
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/app.js", "!src/config/**"],
  coverageThreshold: {
    global: {
      lines: 70,
      statements: 70,
      functions: 70,
      branches: 50,
    },
  },
  moduleFileExtensions: ["js", "json"],
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
