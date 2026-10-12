// Generates web-ready WebP versions of the playground photos.
//   source: assets-src/photos/*.jpg   (full-resolution originals, not deployed)
//   output: public/photos/<name>-<size>.webp
// 1024 = longest side for the 3D textures and phones; 1920 = journey / lightbox.
// Run with `npm run photos` after adding or replacing a photo.
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-src/photos'
const OUT = 'public/photos'
const SIZES = [1024, 1920]

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const file of files) {
  const name = path.parse(file).name
  for (const size of SIZES) {
    const dest = path.join(OUT, `${name}-${size}.webp`)
    const info = await sharp(path.join(SRC, file))
      .rotate()
      .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: size > 1024 ? 78 : 80, effort: 5 })
      .toFile(dest)
    process.stdout.write(`${dest}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB\n`)
  }
}
