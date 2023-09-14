#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

import gallery from '../pageTypes/treatments/gallery';
import articlesList from '../pageTypes/treatments/articlesList';
import noTreatment from '../pageTypes/treatments/noTreatment';
import getPageType from '../pageTypes/getPageType';
import { PROJECT_ROOT } from '../scripts/constants';
import copyStaticAssets from '../utils/copyStaticAssets';

const BUILD_FOLDER = path.join(PROJECT_ROOT, 'public');
const SITE_FOLDER = path.join(PROJECT_ROOT, 'site');

const indexMatcher = `**/index.html`;
async function run(): Promise<void> {
  console.log('Deleting previous build folder...');
  fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
  console.log('Successfully purged old build.');

  console.log('Getting all "html" files...');
  const indexHtmlFiles = await glob(indexMatcher, { cwd: SITE_FOLDER });

  if (indexHtmlFiles.length === 0)
    throw new Error(
      "Couldn't find any `index.html` files. This usually indicates the `site` folder is not set up at the root of the project."
    );

  // Copy shared folder
  await copyStaticAssets('shared', BUILD_FOLDER, SITE_FOLDER);

  for (let i = 0; i < indexHtmlFiles.length; i++) {
    const indexFilePath = indexHtmlFiles[i];
    if (!indexFilePath) throw new Error(`File path could not be found.`);

    console.log(`Starting page build: "${indexFilePath}"`);

    console.log('Getting page type...');
    const fileContents = fs.readFileSync(
      path.join(SITE_FOLDER, indexFilePath),
      'utf-8'
    );

    const pageType = getPageType(fileContents);

    switch (pageType) {
      case 'galleryPage': {
        console.log(`'pageType' found: 'galleryPage' type`);
        await gallery(fileContents, indexFilePath, BUILD_FOLDER, SITE_FOLDER);
        break;
      }
      case 'articlesList': {
        console.log(`'pageType' found: 'articlesList' type`);
        await articlesList(
          fileContents,
          indexFilePath,
          BUILD_FOLDER,
          SITE_FOLDER
        );
        break;
      }
      case 'noTreatment': {
        console.log(`'pageType' not defined; no treatment applied`);
        await noTreatment(
          fileContents,
          indexFilePath,
          BUILD_FOLDER,
          SITE_FOLDER
        );
        break;
      }
    }
  }
}

run();
