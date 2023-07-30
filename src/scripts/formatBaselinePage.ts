import fs from 'node:fs';
import path from 'node:path';
import { HEADER_TOKEN, FOOTER_TOKEN, HOST_PATH } from './constants';

const injectHeader = (page: string) => {
  return page.replace(HEADER_TOKEN, fs.readFileSync('fragments/header.frag', 'utf-8'));
}

const injectFooter = (page: string) => {
  return page.replace(FOOTER_TOKEN, fs.readFileSync('fragments/footer.frag', 'utf-8'));
}

const injectHostPath = (page: string) => {
  return page.replaceAll(HOST_PATH, process.env.PRODUCTION ? '' : path.join(process.cwd(), 'build', 'site'));
}

const formatBaselinePage = (pageContent: string) => {
  return injectHostPath(injectFooter(injectHeader(pageContent)));
}

export default formatBaselinePage;