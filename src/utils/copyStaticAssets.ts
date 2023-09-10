import path from 'node:path';
import fs from 'node:fs';
import { glob } from 'glob';
import writeFileWithDirectory from './writeFileWithDirectory';
import {
  supportedBrowserFiles,
  supportedFontTypes,
  supportedImageTypes,
} from '../constants/supportedFileTypes';

const copyStaticAssets = async (
  folderPath: string,
  buildFolder: string,
  siteFolder: string
) => {
  console.log(
    `Copying files from "${folderPath}" to build folder "${buildFolder}"...`
  );

  const files = await glob(
    `${folderPath}/*.{${[
      ...supportedImageTypes,
      ...supportedFontTypes,
      ...supportedBrowserFiles,
    ]}}`,
    { cwd: path.join(siteFolder) }
  );

  console.log('----files----', files);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file) throw new Error('Something went wrong');

    writeFileWithDirectory(path.join(buildFolder, file), () =>
      fs.copyFileSync(path.join(siteFolder, file), path.join(buildFolder, file))
    );
  }

  console.log(
    `Successfully copied files from "${folderPath}" to "${buildFolder}".`
  );
};

export default copyStaticAssets;
