import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const MAX_DIMENSION = 2560;
const JPEG_QUALITY = 88;

const entries = await fs.readdir(publicDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && /\.(jpe?g)$/i.test(entry.name))
  .map((entry) => path.join(publicDir, entry.name));

let changed = 0;
let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const original = await fs.readFile(file);
  beforeTotal += original.length;

  const image = sharp(original, { failOn: 'none' }).rotate();
  const metadata = await image.metadata();
  const largestSide = Math.max(metadata.width ?? 0, metadata.height ?? 0);

  let pipeline = image;
  if (largestSide > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const optimized = await pipeline
    .jpeg({
      quality: JPEG_QUALITY,
      progressive: true,
      chromaSubsampling: '4:4:4',
      optimizeCoding: true,
    })
    .toBuffer();

  // Never replace an image with a larger file.
  if (optimized.length < original.length) {
    await fs.writeFile(file, optimized);
    changed += 1;
    afterTotal += optimized.length;
    const saved = ((1 - optimized.length / original.length) * 100).toFixed(1);
    console.log(`${path.basename(file)}: ${(original.length / 1048576).toFixed(2)} MB -> ${(optimized.length / 1048576).toFixed(2)} MB (${saved}% smaller)`);
  } else {
    afterTotal += original.length;
  }
}

console.log(`Optimized ${changed}/${files.length} JPEG images.`);
console.log(`Total: ${(beforeTotal / 1048576).toFixed(1)} MB -> ${(afterTotal / 1048576).toFixed(1)} MB`);
