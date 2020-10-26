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

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const inputSrc = 'src/index.js';

export default [
  {
    input: inputSrc,
    output: {
      name: 'fetchye',
      file: pkg.browser,
      format: 'umd',
    },
    external: ['react'],
    plugins: [
      nodeResolve({ extensions: ['.js', '.jsx'], browser: true }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['amex'],
      }),
      terser(),
    ],
  },
  {
    input: inputSrc,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    external: ['react'],
    plugins: [
      nodeResolve({ extensions: ['.js', '.jsx'] }),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: ['amex'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: false }]],
      }),
      terser(),
    ],
  },
  {
    input: inputSrc,
    output: {
      file: pkg.module,
      format: 'es',
    },
    external: ['react'],
    plugins: [
      nodeResolve({ extensions: ['.js', '.jsx'] }),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: ['amex'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]],
      }),
      terser(),
    ],
  },
];
