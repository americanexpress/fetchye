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
      name: 'fetchye-immutable-cache',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      nodeResolve({ browser: true }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: inputSrc,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      nodeResolve(),
      terser(),
    ],
  },
  {
    input: inputSrc,
    output: {
      file: pkg.module,
      format: 'es',
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      nodeResolve(),
      terser(),
    ],
  },
];
