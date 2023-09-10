import fs from 'node:fs';
import path from 'node:path';
import { HEADER_TOKEN, FOOTER_TOKEN, HOST_PATH } from './constants';
import { PROJECT_ROOT } from './constants';

const FRAGMENTS_PATH = path.join(PROJECT_ROOT, 'fragments');

const injectHeader = (page: string) => {
  return page.replace(
    HEADER_TOKEN,
    fs.readFileSync(path.join(FRAGMENTS_PATH, 'header.frag'), 'utf-8')
  );
};

const injectFooter = (page: string) => {
  return page.replace(
    FOOTER_TOKEN,
    fs.readFileSync(path.join(FRAGMENTS_PATH, 'footer.frag'), 'utf-8')
  );
};

export const getHostPath = () => {
  return process.env.PRODUCTION ? '' : path.join(PROJECT_ROOT, 'build', 'site');
};

const injectHostPath = (page: string) => {
  return page.replaceAll(HOST_PATH, getHostPath());
};

const formatBaselinePage = (pageContent: string) => {
  return injectHostPath(injectFooter(injectHeader(pageContent)));
};

export default formatBaselinePage;
