export const HEADER_TOKEN = '{header}';
export const FOOTER_TOKEN = '{footer}';
export const HOST_PATH = '{hostPath}';

const maybeProjectRoot = process.env.INIT_CWD;

if (!maybeProjectRoot)
  throw new Error(
    '`INIT_CWD` not found; you might be using the wrong version of Node.'
  );

export const PROJECT_ROOT = maybeProjectRoot;
