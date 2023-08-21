import path from 'node:path';

import filePathToFolderPath from "../../utils/filePathToFolderPath";
import writeFileWithDirectory from '../../utils/writeFileWithDirectory';
import copyStaticAssets from '../../utils/copyStaticAssets';

export default async function noTreatment(indexContents: string, filePath: string, buildFolder: string): Promise<void> {
  const folderPath = filePathToFolderPath(filePath);

  await copyStaticAssets(folderPath, buildFolder);

  console.log(`Copying "${filePath}" to build folder "${buildFolder}"`);

  writeFileWithDirectory(path.join(buildFolder, filePath), indexContents);

  console.log(`Successfully copied "${filePath}" to "${buildFolder}"`);
}