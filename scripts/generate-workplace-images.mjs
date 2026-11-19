import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const directory = fileURLToPath(new URL("../src/assets/testimonials/workplaces/", import.meta.url));
for (const name of await readdir(directory)) {
  if (!name.endsWith(".jpg")) continue;
  await sharp(`${directory}/${name}`)
    .rotate()
    .resize({ width: 256, withoutEnlargement: true })
    .avif({ quality: 48, effort: 7 })
    .toFile(`${directory}/${name.replace(/\.jpg$/, ".avif")}`);
}
