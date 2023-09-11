import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-preserve-shebang';
import url from '@rollup/plugin-url';

export default {
  input: {
    'posse-init': './src/bin/posse-init.ts',
    'posse-build': './src/bin/posse-build.ts',
    'posse-dev': './src/bin/posse-dev.ts',
    'posse-deploy': './src/bin/posse-deploy.sh',
  },
  output: {
    dir: 'lib/bin',
    format: 'cjs',
    entryFileNames: '[name].cjs'
  },
  plugins: [url({
    include: ['**/*.frag'],
  }), typescript({
    rootDir: '.',
    esModuleInterop: true
  }), shebang({
    shebang: '#!/usr/bin/env node'
  })],
};