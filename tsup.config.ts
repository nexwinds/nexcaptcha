import { defineConfig } from 'tsup';

export default defineConfig([
  // ES modules and CommonJS build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  // Standalone UMD build with React included (for direct HTML usage)
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    outDir: 'dist',
    outExtension: () => ({ js: '.standalone.js' }),
    globalName: 'NexCaptcha',
    splitting: false,
    sourcemap: true,
    esbuildOptions(options) {
      options.globalName = 'NexCaptcha';
      options.define = {
        'process.env.NODE_ENV': '"production"',
      };
      options.banner = {
        js: '(function() {\n"use strict";',
      };
      options.footer = {
        js: 'window.NexCaptcha = NexCaptcha;\n})();',
      };
      options.jsx = 'automatic';
      options.jsxImportSource = 'react';
    },
  },
  // Framework-compatible UMD build (externalizes React for Next.js/React apps)
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    outDir: 'dist',
    outExtension: () => ({ js: '.umd.js' }),
    globalName: 'NexCaptcha',
    splitting: false,
    sourcemap: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.globalName = 'NexCaptcha';
      options.define = {
        'process.env.NODE_ENV': '"production"',
        'React': 'React',
        'ReactDOM': 'ReactDOM'
      };
      options.banner = {
        js: '(function(React, ReactDOM) {\n"use strict";\nif (typeof React === "undefined" || typeof ReactDOM === "undefined") {\n  throw new Error("React and ReactDOM must be loaded before NexCaptcha");\n}',
      };
      options.footer = {
        js: 'window.NexCaptcha = NexCaptcha;\n})(window.React, window.ReactDOM);',
      };
      options.jsx = 'automatic';
      options.jsxImportSource = 'react';
    },
  },
 ]);
 
 // Copy CSS file after build
 const copyStyles = async () => {
   const fs = await import('fs');
   const path = await import('path');
   
   const srcCss = path.join(process.cwd(), 'src', 'styles.css');
   const distCss = path.join(process.cwd(), 'dist', 'styles.css');
   
   if (fs.existsSync(srcCss)) {
     fs.copyFileSync(srcCss, distCss);
   }
 };
 
 copyStyles();