import path from 'node:path';
import fs from 'node:fs';
import { glob } from 'glob';

import filePathToFolderPath from '../../utils/filePathToFolderPath';
import makeElement from '../../utils/makeElement';
import writeFileWithDirectory from '../../utils/writeFileWithDirectory';
import copyStaticAssets from '../../utils/copyStaticAssets';
import { supportedImageTypes } from '../../constants/supportedFileTypes';
import formatBaselinePage from 'src/scripts/formatBaselinePage';

interface ImageMetadata {
  image: string;
  alt: string;
  title: string;
  description: string;
}

function makeGalleryItem(metadata: ImageMetadata) {
  const metadataElements: string[] = [];

  if (metadata.title) {
    metadataElements.push(
      makeElement('h3', { class: 'gallery-item-title' }, metadata.title)
    );
  }

  if (metadata.description) {
    metadataElements.push(
      makeElement(
        'p',
        { class: 'gallery-item-description' },
        metadata.description
      )
    );
  }

  let metadataContainer: string = '';
  if (metadataElements.length > 0) {
    metadataContainer = makeElement(
      'div',
      { class: 'gallery-item-metadata' },
      metadataElements.join('')
    );
  }

  const imgEl = makeElement('img', {
    src: path.join('images', metadata.image),
    class: 'gallery-item-image',
    alt: metadata.alt,
  });

  return makeElement(
    'div',
    { class: 'gallery-item-container' },
    [imgEl, metadataContainer].join('')
  );
}

export default async function gallery(
  indexFileContents: string,
  filePath: string,
  buildFolder: string,
  siteFolder: string
): Promise<void> {
  const folderPath = filePathToFolderPath(filePath);

  // Copy css folder
  await copyStaticAssets(path.join(folderPath, 'css'), buildFolder, siteFolder);
  // Copy images folder
  await copyStaticAssets(
    path.join(folderPath, 'images'),
    buildFolder,
    siteFolder
  );

  console.log(`Building "${filePath}"...`);

  // for some reason, they're grabbed in reverse order
  const images = (
    await glob(path.join('images', `**/*.{${supportedImageTypes.join(',')}}`), {
      cwd: path.join(siteFolder, folderPath),
    })
  ).reverse();
  const metaData = JSON.parse(
    fs.readFileSync(
      path.join(path.join(siteFolder, folderPath), 'metadata.json'),
      'utf-8'
    )
  );

  const galleryHTML = images.reduce((acc, imagePath, index) => {
    const fileName = imagePath.split('/').pop();
    if (!fileName) throw new Error(`Could not get filename for ${imagePath}`);
    acc += makeGalleryItem(metaData[index]);

    return acc;
  }, '');

  console.log(
    `Adding header and footer to "${filePath}" and setting host path...`
  );
  const formattedPage = formatBaselinePage(indexFileContents);

  const newIndexContents = formattedPage.replace(
    '{galleryContainer}',
    galleryHTML
  );

  writeFileWithDirectory(path.join(buildFolder, filePath), newIndexContents);
  console.log(`Successfully built index.html; copied to "${buildFolder}"`);
}
