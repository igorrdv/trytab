const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
};
