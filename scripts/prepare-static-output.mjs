import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const index = path.join(output, 'index.html');
const fallback = path.join(output, '404.html');

await copyFile(index, fallback);
await copyFile(path.join(root, 'CNAME'), path.join(output, 'CNAME'));

const [indexContents, fallbackContents] = await Promise.all([
  readFile(index),
  readFile(fallback),
]);

if (!indexContents.equals(fallbackContents)) {
  throw new Error('The static route fallback does not match index.html.');
}

if (indexContents.length === 0) {
  throw new Error('The production entry document is empty.');
}
