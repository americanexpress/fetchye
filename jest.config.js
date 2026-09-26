/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

module.exports = {
  preset: 'amex-jest-preset-react',
  setupFilesAfterEnv: [
    './test-setup.js',
  ],
  snapshotSerializers: [],
  testMatch: [
    '**/__tests__/**/*.spec.{js,jsx}',
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{js,jsx}',
    '!packages/*/src/**/index.{js,jsx}',
  ],
  moduleNameMapper: {
    '^fetchye-redux-provider$': '<rootDir>/packages/fetchye-redux-provider/src/index.js',
    '^fetchye$': '<rootDir>/packages/fetchye/src/index.js',
    // These packages (transitive deps of `cacheable`) declare "main" as an ESM file even
    // though they ship a CJS build (only exposed via "exports"). Jest 26 does not honor the
    // package "exports" field, so it would otherwise resolve to the unusable ESM entry point.
    '^keyv$': '<rootDir>/node_modules/keyv/dist/index.cjs',
    '^hookified$': '<rootDir>/node_modules/hookified/dist/node/index.cjs',
    '^hashery$': '<rootDir>/node_modules/hashery/dist/node/index.cjs',
  },
  coveragePathIgnorePatterns: ['packages/fetchye-test-utils/src/testCacheInterface.js'],
};
