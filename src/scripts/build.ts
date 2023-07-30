import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

import gallery from '../pageTypes/treatments/gallery';
import noTreatment from '../pageTypes/treatments/noTreatment';
import formatBaselinePage from './formatBaselinePage';
import getPageType from '../pageTypes/getPageType';

const indexMatcher = '**/*/index.html';

const BUILD_FOLDER = path.join('build');

async function run(): Promise<void> {
  console.log('Deleting previous build folder...');
  fs.rmSync(BUILD_FOLDER, { recursive: true, force: true});
  console.log('Successfully purged old build.');

  console.log('Getting all "html" files...')
  const indexHtmlFiles = await glob(indexMatcher);

  for(let i = 0; i < indexHtmlFiles.length; i++) {
    const filePath = indexHtmlFiles[i];
    if (!filePath) throw new Error(`File path could not be found.`);

    console.log(`Starting page build: "${filePath}"`)

    console.log('Getting page type...');
    const fileContents = fs.readFileSync(filePath, 'utf-8');

    console.log(`Adding header and footer to "${filePath}" and setting host path...`)
    const formattedPage = formatBaselinePage(fileContents);

    const pageType = getPageType(fileContents);

    switch(pageType) {
      case 'galleryPage': {
        console.log(`'pageType' found: 'galleryPage' type`)
        await gallery(formattedPage, filePath, BUILD_FOLDER);
        break;
      }
      case 'noTreatment': {
        console.log(`'pageType' not defined; no treatment applied`)
        await noTreatment(formattedPage, filePath, BUILD_FOLDER);
        break;
      }
    }
  };
}

run();