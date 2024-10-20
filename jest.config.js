module.exports = {
  global: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
  moduleFileEXtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMacth: ["**/tests/**/*.test.+(ts|js)"],
  testEnvironment: "node",
}