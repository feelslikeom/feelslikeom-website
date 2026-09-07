import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const MAX_DIMENSION = 2560;
const JPEG_QUALITY = 88;
const REFLECTION_THUMB_MAX = 640;
const REFLECTION_THUMB_QUALITY = 82;

const reflectionImages = [
  'amos.jpg', 'tangen.jpg', 'heather.jpg', 'kwanwei.jpg', 'liyan.jpg', 'mirza.jpg',
  'bingming.jpg', 'synthdi.jpg', 'ying.jpg', 'vilma.jpg', 'satya.jpg', 'jx.jpg',
  'sharon.jpg', 'kellie.jpg', 'lianne.jpg', 'ziqing.jpg', 'samantha.jpg', 'cheryl.jpg',
  'angela.jpg', 'marilyn.jpg', 'justin.jpg', 'hilda.jpg', 'kaixuan.jpg', 'nitya.jpg',
  'yongxi.jpg', 'belancia.jpg', 'boju.jpg', 'fabian.jpg', 'jasmine.jpg', 'nicholas.jpg',
  'shermin.jpg',
];

const entries = await fs.readdir(publicDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name))
  .map((entry) => path.join(publicDir, entry.name));

let changed = 0;
let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const original = await fs.readFile(file);
  beforeTotal += original.length;

  const extension = path.extname(file).toLowerCase();
  const image = sharp(original, { failOn: 'none' }).rotate();
  const metadata = await image.metadata();
  const largestSide = Math.max(metadata.width ?? 0, metadata.height ?? 0);

  let pipeline = image;
  if (largestSide > MAX_DIMENSION && extension !== '.png') {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const optimized = extension === '.png'
    ? await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true, palette: false }).toBuffer()
    : await pipeline
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

// Reflection circles are only about 60–85 px on screen. Generate lightweight WebP
// derivatives so the page does not download multi-megabyte originals just to show thumbnails.
const thumbsDir = path.join(publicDir, 'reflection-thumbs');
await fs.mkdir(thumbsDir, { recursive: true });

let thumbsCreated = 0;
for (const filename of reflectionImages) {
  const source = path.join(publicDir, filename);
  try {
    await fs.access(source);
  } catch {
    console.warn(`Skipping missing reflection image: ${filename}`);
    continue;
  }

  const outputName = `${path.parse(filename).name}.webp`;
  const output = path.join(thumbsDir, outputName);
  const next = await sharp(source, { failOn: 'none' })
    .rotate()
    .resize({
      width: REFLECTION_THUMB_MAX,
      height: REFLECTION_THUMB_MAX,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: REFLECTION_THUMB_QUALITY, effort: 5 })
    .toBuffer();

  let current = null;
  try {
    current = await fs.readFile(output);
  } catch {}

  if (!current || !current.equals(next)) {
    await fs.writeFile(output, next);
    thumbsCreated += 1;
  }
}

console.log(`Optimized ${changed}/${files.length} JPEG/PNG images.`);
console.log(`Total: ${(beforeTotal / 1048576).toFixed(1)} MB -> ${(afterTotal / 1048576).toFixed(1)} MB`);
console.log(`Generated/updated ${thumbsCreated} reflection WebP thumbnails at max ${REFLECTION_THUMB_MAX}px.`);
