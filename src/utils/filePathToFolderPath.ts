export default function filePathToFolderPath(filePath: string): string {
  const splitPath = filePath.split('/');
  splitPath.pop();
  return splitPath.join('/');
}