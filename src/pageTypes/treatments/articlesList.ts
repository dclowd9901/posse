import path from 'node:path';
import fs from 'node:fs';
import { glob } from 'glob';
import { Converter } from 'showdown';
import makeElement from '../../utils/makeElement';
import filePathToFolderPath from '../../utils/filePathToFolderPath';
import writeFileWithDirectory from '../../utils/writeFileWithDirectory';
import { getHostPath } from '../../scripts/formatBaselinePage';
import copyStaticAssets from '../../utils/copyStaticAssets';

const converter = new Converter();
const listToken = '{articlesList}';

interface ArticleDate {
  year: string;
  month: string;
  day: string;
}

/*
	Superficial validation of date to ensure date parts are in correct order.
*/
const testIfValidDate = (serializedDate: string) => {
  if (serializedDate.length === 8) {
    if (parseInt(serializedDate, 10).toString() === serializedDate) {
      const year = serializedDate.substring(0, 4);
      const yearAsNumber = parseInt(year, 10);
      if (yearAsNumber >= 1000 && yearAsNumber <= 9999) {
        const month = serializedDate.substring(4, 6);
        const monthAsNumber = parseInt(month, 10);

        if (monthAsNumber >= 1 && monthAsNumber <= 12) {
          const day = serializedDate.substring(6, 8);
          const dayAsNumber = parseInt(day, 10);

          if (dayAsNumber >= 1 && dayAsNumber <= 31) {
            return true;
          }
        }
      }
    }
  }

  throw new Error(
    `Date prefix "${serializedDate}" is invalid; it must follow the pattern YYYYMMDD`
  );
};

const getArticlePaths = async (folderPath: string, siteFolder: string) =>
  await glob(path.join(`${folderPath}/**/*.md`), { cwd: siteFolder });

const process = async (
  indexContents: string,
  filePath: string,
  buildFolder: string,
  siteFolder: string
) => {
  const folderPath = filePathToFolderPath(filePath);

  await copyStaticAssets(folderPath, buildFolder, siteFolder);

  console.log('--------folderPath---------', folderPath);
  const articlePaths = await getArticlePaths(folderPath, siteFolder);

  console.log('Building article pages and folders...');
  const articleLinks = buildArticles(
    articlePaths,
    folderPath,
    indexContents,
    buildFolder,
    siteFolder
  );
  buildArticleListPage(filePath, articleLinks, indexContents, buildFolder);
};

const buildArticleListPage = (
  filePath: string,
  articleLinks: ArticleLinkDescription[],
  indexContents: string,
  buildFolder: string
) => {
  const articleListElements = articleLinks.map(
    (articleLink: ArticleLinkDescription) => {
      const splitPath = articleLink.path.split('/');
      splitPath.shift(); // Removes empty item
      splitPath.shift(); // Removes `site`
      const urlFriendlyPath = '/' + splitPath.join('/');
      const aElement = makeElement(
        'a',
        {
          class: 'article-link',
          href: path.join(getHostPath(), urlFriendlyPath),
        },
        articleLink.title
      );
      return makeElement('li', { class: 'article-list-item' }, aElement);
    }
  );

  const ul = makeElement(
    'ul',
    { class: 'article-list' },
    articleListElements.join('')
  );

  const indexContentsWithLinks = indexContents.replace(listToken, ul);
  writeFileWithDirectory(
    path.join(buildFolder, filePath),
    indexContentsWithLinks
  );
};

interface ArticleLinkDescription {
  path: string;
  title: string;
}

const buildArticles = (
  articlePaths: string[],
  folderPath: string,
  indexFileContents: string,
  buildFolder: string,
  siteFolder: string
): ArticleLinkDescription[] => {
  const articleLinks: ArticleLinkDescription[] = [];

  console.log('--------article paths---------', articlePaths);
  articlePaths.forEach((articlePath) => {
    const article = fs.readFileSync(
      path.join(siteFolder, articlePath),
      'utf-8'
    );
    const articleTitleRegex = /##\s+([^\n]+)/s;
    const articleMatches = article.match(articleTitleRegex);
    const articleTitle = articleMatches?.[1];

    if (typeof articleTitle !== 'string') {
      throw new Error(
        `Could not find title for article at path ${articlePath}; Be sure to use the '##' H2 Markdown syntax for your post title.`
      );
    }

    const markedUpContent = converter.makeHtml(article);
    const newPageWithMarkedUpContent = indexFileContents.replace(
      listToken,
      makeElement('div', { class: 'article' }, markedUpContent)
    );

    const fileName = path.basename(articlePath);
    const serializedDate = fileName.split('_')[0] || '';

    testIfValidDate(serializedDate || '');

    const date: ArticleDate = {
      year: serializedDate.substring(0, 4) || '',
      month: serializedDate.substring(4, 6) || '',
      day: serializedDate.substring(6, 8) || '',
    };

    const dateFilePath = path.join(date.year, date.month, date.day);
    const publishedArticlePath = path.join(
      folderPath,
      dateFilePath,
      'index.html'
    );
    const newIndexPath = path.join(buildFolder, publishedArticlePath);
    writeFileWithDirectory(newIndexPath, newPageWithMarkedUpContent);

    console.log(`Successfully build index.html; copied to "${newIndexPath}"`);

    articleLinks.push({
      path: `/${publishedArticlePath}`,
      title: articleTitle,
    });
  });

  return articleLinks;
};

export default process;
