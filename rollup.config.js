import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'manifest.json',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    chromeExtension({ browserPolyfill: true }),
    simpleReloader(),
    postcss({
      modules: true
    }),
    resolve(),
    commonjs(),
    typescript({ exclude: 'scraper/*' })
  ]
};
