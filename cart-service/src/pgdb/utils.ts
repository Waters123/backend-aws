const toCamelCase = (value: string): string => value.split('_')
  .map((word, idx) => (idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
  .join('');

export const objKeysToCamelCase = (obj, keys = []) => Object.fromEntries(
  Object.entries(obj).map(([key, value]) => [
    keys.length && !keys.includes(key) ? key : toCamelCase(key),
    value
  ]),
);