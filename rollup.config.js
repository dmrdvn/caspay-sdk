import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default [
  // CommonJS (Node.js)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    external: ['casper-js-sdk'],
    plugins: [typescript(), resolve(), commonjs(), json()]
  },
  // ESM (React/Next.js)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    external: ['casper-js-sdk'],
    plugins: [typescript(), resolve(), commonjs(), json()]
  },
  // UMD (Browser - includes all dependencies)
  {
    input: 'src/browser.ts',
    output: {
      file: 'dist/caspay.min.js',
      format: 'umd',
      name: 'CasPay',
      exports: 'default',
      globals: {}
    },
    plugins: [
      typescript(),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      json(),
      terser()
    ]
  }
];
