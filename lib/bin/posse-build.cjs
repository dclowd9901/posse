#!/usr/bin/env node
'use strict';

var fs = require('node:fs');
var path = require('node:path');
var glob = require('glob');
var showdown = require('showdown');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function filePathToFolderPath(filePath) {
    const splitPath = filePath.split('/');
    splitPath.pop();
    return splitPath.join('/');
}

function buildProperties(properties) {
    return Object.keys(properties).reduce((propsOutput, key) => {
        propsOutput += ` ${key}="${properties[key]}"`;
        return propsOutput;
    }, '');
}
function makeElement(tag, properties, contents) {
    const resolvedProperties = properties ? buildProperties(properties) : '';
    if (!contents) {
        return `<${tag} ${resolvedProperties} />`;
    }
    return `<${tag} ${resolvedProperties}>${contents}</${tag}>`;
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}
function writeFileWithDirectory(filePath, contents) {
    ensureDirectoryExistence(filePath);
    if (typeof contents === 'string') {
        fs.writeFileSync(filePath, contents);
    }
    else {
        contents();
    }
}

const supportedImageTypes = [
    'apng',
    'avif',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'webp'
];
const supportedFontTypes = [
    'ttf',
    'otf',
    'woff',
    'woff2'
];
const supportedBrowserFiles = [
    'html',
    'css'
];

const copyStaticAssets = (folderPath, buildFolder, siteFolder) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Copying files from "${folderPath}" to build folder "${buildFolder}"...`);
    const files = yield glob.glob(`${folderPath}/*.{${[
        ...supportedImageTypes,
        ...supportedFontTypes,
        ...supportedBrowserFiles,
    ]}}`, { cwd: path.join(siteFolder) });
    console.log('----files----', files);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file)
            throw new Error('Something went wrong');
        writeFileWithDirectory(path.join(buildFolder, file), () => fs.copyFileSync(path.join(siteFolder, file), path.join(buildFolder, file)));
    }
    console.log(`Successfully copied files from "${folderPath}" to "${buildFolder}".`);
});

function makeGalleryItem(metadata) {
    const metadataElements = [];
    if (metadata.title) {
        metadataElements.push(makeElement('h3', { class: 'gallery-item-title' }, metadata.title));
    }
    if (metadata.description) {
        metadataElements.push(makeElement('p', { class: 'gallery-item-description' }, metadata.description));
    }
    let metadataContainer = '';
    if (metadataElements.length > 0) {
        metadataContainer = makeElement('div', { class: 'gallery-item-metadata' }, metadataElements.join(''));
    }
    const imgEl = makeElement('img', {
        src: path.join('images', metadata.image),
        class: 'gallery-item-image',
        alt: metadata.alt,
    });
    return makeElement('div', { class: 'gallery-item-container' }, [imgEl, metadataContainer].join(''));
}
function gallery(indexContents, filePath, buildFolder, siteFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = filePathToFolderPath(filePath);
        yield copyStaticAssets(path.join(folderPath, 'css'), buildFolder, siteFolder);
        yield copyStaticAssets(path.join(folderPath, 'images'), buildFolder, siteFolder);
        console.log(`Building "${filePath}"...`);
        const images = (yield glob.glob(path.join('images', `**/*.{${supportedImageTypes.join(',')}}`), {
            cwd: path.join(siteFolder, folderPath),
        })).reverse();
        const metaData = JSON.parse(fs.readFileSync(path.join(path.join(siteFolder, folderPath), 'metadata.json'), 'utf-8'));
        const galleryHTML = images.reduce((acc, imagePath, index) => {
            const fileName = imagePath.split('/').pop();
            if (!fileName)
                throw new Error(`Could not get filename for ${imagePath}`);
            acc += makeGalleryItem(metaData[index]);
            return acc;
        }, '');
        const newIndexContents = indexContents.replace('{galleryContainer}', galleryHTML);
        writeFileWithDirectory(path.join(buildFolder, filePath), newIndexContents);
        console.log(`Successfully built index.html; copied to "${buildFolder}"`);
    });
}

const HEADER_TOKEN = '{header}';
const FOOTER_TOKEN = '{footer}';
const HOST_PATH = '{hostPath}';
const maybeProjectRoot = process.env.INIT_CWD;
if (!maybeProjectRoot)
    throw new Error('`INIT_CWD` not found; you might be using the wrong version of Node.');
const PROJECT_ROOT = maybeProjectRoot;

const FRAGMENTS_PATH = path.join(PROJECT_ROOT, 'fragments');
const injectHeader = (page) => {
    return page.replace(HEADER_TOKEN, fs.readFileSync(path.join(FRAGMENTS_PATH, 'header.frag'), 'utf-8'));
};
const injectFooter = (page) => {
    return page.replace(FOOTER_TOKEN, fs.readFileSync(path.join(FRAGMENTS_PATH, 'footer.frag'), 'utf-8'));
};
const getHostPath = () => {
    return process.env.PRODUCTION ? '' : path.join(PROJECT_ROOT, 'build', 'site');
};
const injectHostPath = (page) => {
    return page.replaceAll(HOST_PATH, getHostPath());
};
const formatBaselinePage = (pageContent) => {
    return injectHostPath(injectFooter(injectHeader(pageContent)));
};

const converter = new showdown.Converter();
const listToken = '{articlesList}';
const testIfValidDate = (serializedDate) => {
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
    throw new Error(`Date prefix "${serializedDate}" is invalid; it must follow the pattern YYYYMMDD`);
};
const getArticlePaths = (folderPath, siteFolder) => __awaiter(void 0, void 0, void 0, function* () { return yield glob.glob(path.join(`${folderPath}/**/*.md`), { cwd: siteFolder }); });
const process$1 = (indexContents, filePath, buildFolder, siteFolder) => __awaiter(void 0, void 0, void 0, function* () {
    const folderPath = filePathToFolderPath(filePath);
    yield copyStaticAssets(path.join(folderPath, 'css'), buildFolder, siteFolder);
    console.log('--------folderPath---------', folderPath);
    const articlePaths = yield getArticlePaths(folderPath, siteFolder);
    console.log('Building article pages and folders...');
    const articleLinks = buildArticles(articlePaths, folderPath, indexContents, buildFolder, siteFolder);
    buildArticleListPage(filePath, articleLinks, indexContents, buildFolder);
});
const buildArticleListPage = (filePath, articleLinks, indexContents, buildFolder) => {
    const articleListElements = articleLinks.map((articleLink) => {
        const splitPath = articleLink.path.split('/');
        splitPath.shift();
        splitPath.shift();
        const urlFriendlyPath = '/' + splitPath.join('/');
        const aElement = makeElement('a', {
            class: 'article-link',
            href: path.join(getHostPath(), urlFriendlyPath),
        }, articleLink.title);
        return makeElement('li', { class: 'article-list-item' }, aElement);
    });
    const ul = makeElement('ul', { class: 'article-list' }, articleListElements.join(''));
    const indexContentsWithLinks = indexContents.replace(listToken, ul);
    writeFileWithDirectory(path.join(buildFolder, filePath), indexContentsWithLinks);
};
const buildArticles = (articlePaths, folderPath, indexFileContents, buildFolder, siteFolder) => {
    const articleLinks = [];
    console.log('--------article paths---------', articlePaths);
    articlePaths.forEach((articlePath) => {
        const article = fs.readFileSync(path.join(siteFolder, articlePath), 'utf-8');
        const articleTitleRegex = /##\s+([^\n]+)/s;
        const articleMatches = article.match(articleTitleRegex);
        const articleTitle = articleMatches === null || articleMatches === void 0 ? void 0 : articleMatches[1];
        if (typeof articleTitle !== 'string') {
            throw new Error(`Could not find title for article at path ${articlePath}; Be sure to use the '##' H2 Markdown syntax for your post title.`);
        }
        const markedUpContent = converter.makeHtml(article);
        const newPageWithMarkedUpContent = indexFileContents.replace(listToken, makeElement('div', { class: 'article' }, markedUpContent));
        const fileName = path.basename(articlePath);
        const serializedDate = fileName.split('_')[0] || '';
        testIfValidDate(serializedDate || '');
        const date = {
            year: serializedDate.substring(0, 4) || '',
            month: serializedDate.substring(4, 6) || '',
            day: serializedDate.substring(6, 8) || '',
        };
        const dateFilePath = path.join(date.year, date.month, date.day);
        const publishedArticlePath = path.join(folderPath, dateFilePath, 'index.html');
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

function noTreatment(indexContents, filePath, buildFolder, siteFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = filePathToFolderPath(filePath);
        yield copyStaticAssets(path.join(folderPath, 'css'), buildFolder, siteFolder);
        yield copyStaticAssets(path.join(folderPath, 'images'), buildFolder, siteFolder);
        console.log(`Copying "${filePath}" to build folder "${buildFolder}"`);
        writeFileWithDirectory(path.join(buildFolder, filePath), indexContents);
        console.log(`Successfully copied "${filePath}" to "${buildFolder}"`);
    });
}

function testPageType(value) {
    if (value === 'galleryPage') {
        return value;
    }
    if (value === 'articlesList') {
        return value;
    }
    return 'noTreatment';
}
const getPageType = (pageContents) => {
    var _a;
    const pageTypeMatcher = /pageType:\s*(\w+)/;
    const possiblePageType = (_a = pageTypeMatcher.exec(pageContents)) === null || _a === void 0 ? void 0 : _a[1];
    return testPageType(possiblePageType);
};

const BUILD_FOLDER = path.join(PROJECT_ROOT, 'public');
const SITE_FOLDER = path.join(PROJECT_ROOT, 'site');
const indexMatcher = `**/index.html`;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Deleting previous build folder...');
        fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
        console.log('Successfully purged old build.');
        console.log('Getting all "html" files...');
        const indexHtmlFiles = yield glob.glob(indexMatcher, { cwd: SITE_FOLDER });
        if (indexHtmlFiles.length === 0)
            throw new Error("Couldn't find any `index.html` files. This usually indicates the `site` folder is not set up at the root of the project.");
        yield copyStaticAssets('shared', BUILD_FOLDER, SITE_FOLDER);
        for (let i = 0; i < indexHtmlFiles.length; i++) {
            const indexFilePath = indexHtmlFiles[i];
            if (!indexFilePath)
                throw new Error(`File path could not be found.`);
            console.log(`Starting page build: "${indexFilePath}"`);
            console.log('Getting page type...');
            const fileContents = fs.readFileSync(path.join(SITE_FOLDER, indexFilePath), 'utf-8');
            console.log(`Adding header and footer to "${indexFilePath}" and setting host path...`);
            const formattedPage = formatBaselinePage(fileContents);
            const pageType = getPageType(fileContents);
            switch (pageType) {
                case 'galleryPage': {
                    console.log(`'pageType' found: 'galleryPage' type`);
                    yield gallery(formattedPage, indexFilePath, BUILD_FOLDER, SITE_FOLDER);
                    break;
                }
                case 'articlesList': {
                    console.log(`'pageType' found: 'articlesList' type`);
                    yield process$1(formattedPage, indexFilePath, BUILD_FOLDER, SITE_FOLDER);
                    break;
                }
                case 'noTreatment': {
                    console.log(`'pageType' not defined; no treatment applied`);
                    yield noTreatment(formattedPage, indexFilePath, BUILD_FOLDER, SITE_FOLDER);
                    break;
                }
            }
        }
    });
}
run();
