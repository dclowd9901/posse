import path from 'node:path';
import fs from 'node:fs';

function ensureDirectoryExistence(filePath: string): void | boolean {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

export default function writeFileWithDirectory(filePath: string, contents: string | (() => void)) : void {
  ensureDirectoryExistence(filePath);

  if (typeof contents === 'string') {
    fs.writeFileSync(filePath, contents);
  } else {
    contents();
  }
}