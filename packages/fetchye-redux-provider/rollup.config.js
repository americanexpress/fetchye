import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'fetchye-redux-provider',
      file: pkg.browser,
      format: 'umd',
    },
    external: ['react', 'react-dom'],
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
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    external: ['react', 'react-dom'],
    plugins: [
      nodeResolve({ extensions: ['.js', '.jsx'] }),
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
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
    },
    external: ['react', 'react-dom'],
    plugins: [
      nodeResolve({ extensions: ['.js', '.jsx'] }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['amex'],
      }),
      terser(),
    ],
  },
];