import path from 'node:path';

import filePathToFolderPath from '../../utils/filePathToFolderPath';
import writeFileWithDirectory from '../../utils/writeFileWithDirectory';
import copyStaticAssets from '../../utils/copyStaticAssets';
import formatBaselinePage from 'src/scripts/formatBaselinePage';

export default async function noTreatment(
  indexFileContents: string,
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

  console.log(
    `Adding header and footer to "${filePath}" and setting host path...`
  );
  const formattedPage = formatBaselinePage(indexFileContents, '../../..');

  writeFileWithDirectory(path.join(buildFolder, filePath), formattedPage);

  console.log(`Successfully copied "${filePath}" to "${buildFolder}"`);
}
