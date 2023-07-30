interface Properties {
  [key: string]: unknown
}

function buildProperties(properties: Properties): string {
  return Object.keys(properties).reduce((propsOutput, key) => {
    propsOutput += ` ${key}="${properties[key]}"`;

    return propsOutput;
  }, '');
}

export default function makeElement(tag: string, properties?: Properties, contents?: string) {
  const resolvedProperties = properties ? buildProperties(properties) : '';

  if (!contents){
    return `<${tag} ${resolvedProperties} />`;
  }

  return `<${tag} ${resolvedProperties}>${contents}</${tag}>`;
}