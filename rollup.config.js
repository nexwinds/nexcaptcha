import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { dts } from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';

import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  input: 'src/index.ts',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'next'],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
    }),
    postcss({
      config: {
        path: './postcss.config.js',
      },
      extensions: ['.css'],
      minimize: isProduction,
      inject: {
        insertAt: 'top',
      },
    }),
    filesize(),
  ],
};

const configs = [
  // ESM build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ...baseConfig.plugins,
      isProduction && terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          reserved: ['NexCaptcha'],
        },
      }),
    ].filter(Boolean),
  },
  // CommonJS build
  {
    ...baseConfig,
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      ...baseConfig.plugins,
      isProduction && terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          reserved: ['NexCaptcha'],
        },
      }),
    ].filter(Boolean),
  },
  // UMD build for browser
  {
    ...baseConfig,
    output: {
      file: 'dist/nexcaptcha.umd.js',
      format: 'umd',
      name: 'NexCaptcha',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'React',
        next: 'Next',
      },
    },
    plugins: [
      ...baseConfig.plugins,
      isProduction && terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          reserved: ['NexCaptcha'],
        },
      }),
    ].filter(Boolean),
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.types,
      format: 'esm',
    },
    plugins: [dts()],
    external: [/\.(css|less|scss|sass)$/],
  },
];

export default configs;