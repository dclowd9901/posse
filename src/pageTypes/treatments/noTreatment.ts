import path from 'node:path';

import filePathToFolderPath from '../../utils/filePathToFolderPath';
import writeFileWithDirectory from '../../utils/writeFileWithDirectory';
import copyStaticAssets from '../../utils/copyStaticAssets';

export default async function noTreatment(
  indexContents: string,
  filePath: string,
  buildFolder: string,
  siteFolder: string
): Promise<void> {
  const folderPath = filePathToFolderPath(filePath);

  // Copy CSS folder
  await copyStaticAssets(path.join(folderPath, 'css'), buildFolder, siteFolder);
  // Copy images folder
  await copyStaticAssets(
    path.join(folderPath, 'images'),
    buildFolder,
    siteFolder
  );

  console.log(`Copying "${filePath}" to build folder "${buildFolder}"`);

  writeFileWithDirectory(path.join(buildFolder, filePath), indexContents);

  console.log(`Successfully copied "${filePath}" to "${buildFolder}"`);
}
