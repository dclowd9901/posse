import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: {
    'posse-init': './src/bin/posse-init.ts',
    'posse-build': './src/bin/posse-build.ts',
  },
  output: {
    dir: 'lib/bin',
    format: 'cjs',
    entryFileNames: '[name].cjs'
  },
  plugins: [typescript({
    rootDir: '.',
    esModuleInterop: true
  }), shebang({
    shebang: '#!/usr/bin/env node'
  })],
};