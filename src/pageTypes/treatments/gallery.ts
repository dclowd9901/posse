import path from 'node:path';
import fs from 'node:fs';
import { glob } from 'glob';

import filePathToFolderPath from "../../utils/filePathToFolderPath";
import makeElement from "../../utils/makeElement";
import writeFileWithDirectory from '../../utils/writeFileWithDirectory';
import copyStaticAssets from '../../utils/copyStaticAssets';

interface ImageMetadata {
  alt: string;
  title: string;
  description: string;
}

function makeGalleryItem(imgSrc: string, metadata: ImageMetadata) {
  const titleEl = makeElement('h3', { class: 'gallery-item-title' }, metadata.title);
  const descriptionEl = makeElement('p', { class: 'gallery-item-description' }, metadata.description);
  const metadataContainer = makeElement('div', { class: 'gallery-item-metadata' }, [titleEl, descriptionEl].join(''));
  const imgEl = makeElement('img', { src: imgSrc, class: 'gallery-item-image', alt: metadata.alt});
  
  return makeElement('div', { class: 'gallery-item-container' }, [imgEl, metadataContainer].join(''));
}

export default async function gallery(indexContents: string, filePath: string, buildFolder: string): Promise<void> {
  const folderPath = filePathToFolderPath(filePath);

  copyStaticAssets(folderPath, buildFolder);
  
  console.log(`Building "${filePath}"...`);

  // for some reason, they're grabbed in reverse order
  const images = (await glob(path.join(folderPath, 'images', '**/*.jpg'))).reverse();
  const metaData = JSON.parse(fs.readFileSync(path.join(folderPath, 'metadata.json'), 'utf-8'));

  const galleryHTML = images.reduce((acc, imagePath, index) => {
    const fileName = imagePath.split('/').pop();
    if (!fileName) throw new Error(`Could not get filename for ${imagePath}`); 
    acc += makeGalleryItem(path.join('images', fileName), metaData[index]);

    return acc;
  }, '');

  const newIndexContents = indexContents.replace('{galleryContainer}', galleryHTML);

  writeFileWithDirectory(path.join(buildFolder, filePath), newIndexContents);
  console.log(`Successfully built index.html; copied to "${buildFolder}"`);
}