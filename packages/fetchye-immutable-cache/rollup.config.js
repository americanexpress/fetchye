import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
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
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    external: ['immutable'],
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
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
    },
    external: ['immutable'],
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
