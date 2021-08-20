import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import autoprefixer from 'autoprefixer';

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
      modules: true,
      plugins: [autoprefixer()]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve(),
    commonjs(),
    typescript({ exclude: 'scraper/*' })
  ]
};
