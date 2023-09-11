#!/usr/bin/env node

import * as fse from 'fs-extra';
import path from 'node:path';

if (!process.env.INIT_CWD) {
  throw new Error("For some reason, INIT_CWD wasn't set.");
}

/* Yes, this means you can't use Yarn PnP with this package */
const posseNodeModulePath = path.join(
  process.env.INIT_CWD,
  'node_modules',
  '@dclowd9901',
  'posse'
);

console.log('Copying fragments...');
fse.copySync(
  path.join(posseNodeModulePath, 'scaffolding', 'fragments'),
  path.join(process.env.INIT_CWD, 'fragments'),
  {
    overwrite: true,
  }
);
console.log('Copying example site...');
fse.copySync(
  path.join(posseNodeModulePath, 'scaffolding', 'site'),
  path.join(process.env.INIT_CWD, 'site'),
  { overwrite: true }
);
