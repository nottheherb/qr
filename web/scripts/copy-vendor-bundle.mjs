import { copyFile, rm } from 'node:fs/promises';

const buildDirectory = new URL('../.vendor-build/', import.meta.url);

await copyFile(
  new URL('qrcode.js', buildDirectory),
  new URL('../qrcode.js', import.meta.url),
);
await rm(buildDirectory, { recursive: true, force: true });
