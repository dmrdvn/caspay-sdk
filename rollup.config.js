import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default [
  // CommonJS (Node.js)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto'
    },
    plugins: [typescript(), resolve(), commonjs()]
  },
  // ESM (React/Next.js)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    plugins: [typescript(), resolve(), commonjs()]
  },
  // UMD (WordPress Browser)
  {
    input: 'src/browser.ts',
    output: {
      file: 'dist/caspay.min.js',
      format: 'umd',
      name: 'CasPay'
    },
    plugins: [typescript(), resolve(), commonjs(), terser()]
  }
];
