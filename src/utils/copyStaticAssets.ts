import path from 'node:path';
import fs from 'node:fs';
import { glob } from 'glob';
import writeFileWithDirectory from './writeFileWithDirectory';

const copyStaticAssets = async (folderPath: string, buildFolder: string) => {
  console.log(`Copying files from "${folderPath}" to build folder "${buildFolder}"...`);

  const files = await glob(`${folderPath}/**/*.{css,jpg,ttf,svg}`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file) throw new Error('Something went wrong');

    writeFileWithDirectory(path.join(buildFolder, file), () => fs.copyFileSync(file, path.join(buildFolder, file)));
  }

  console.log(`Successfully copied files from "${folderPath}" to "${buildFolder}".`);
}

export default copyStaticAssets;