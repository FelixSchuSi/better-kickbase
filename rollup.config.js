import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';

export default {
  input: 'manifest.json',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    chromeExtension(),
    simpleReloader(),
    postcss({
      modules: true
    }),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    }),
    resolve(),
    commonjs(),
    typescript({ exclude: 'scraper/*' })
  ]
};
