import { Nullable } from "index";
import { PageType } from "./pageTypes";

function testPageType(value?: string | null): PageType {
  if (value === 'galleryPage') {
    return value;
  }

  // Add more pageTypes here

  return 'noTreatment';
}

const getPageType = (pageContents: string) => {
  const pageTypeMatcher = /pageType:\s*(\w+)/
  const possiblePageType: Nullable<string> = pageTypeMatcher.exec(pageContents)?.[1];
  return testPageType(possiblePageType);
}

export default getPageType;