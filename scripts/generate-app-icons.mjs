import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(root, "public");
const source = path.join(publicDirectory, "favicon.png");

await mkdir(publicDirectory, { recursive: true });

const resizePng = (size) =>
  sharp(source)
    .resize(size, size, { fit: "contain", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

const outputSizes = [180, 192, 512];
await Promise.all(
  outputSizes.map(async (size) => {
    const name = size === 180 ? "apple-touch-icon.png" : `favicon-${size}.png`;
    await writeFile(path.join(publicDirectory, name), await resizePng(size));
  }),
);

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map(resizePng));
icoImages.push(await readFile(source));

const headerSize = 6;
const directoryEntrySize = 16;
const directorySize = directoryEntrySize * icoImages.length;
const header = Buffer.alloc(headerSize + directorySize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);

let offset = header.length;
icoImages.forEach((image, index) => {
  const size = index < icoSizes.length ? icoSizes[index] : 256;
  const entry = headerSize + index * directoryEntrySize;
  header.writeUInt8(size === 256 ? 0 : size, entry);
  header.writeUInt8(size === 256 ? 0 : size, entry + 1);
  header.writeUInt8(0, entry + 2);
  header.writeUInt8(0, entry + 3);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});

await writeFile(path.join(publicDirectory, "favicon.ico"), Buffer.concat([header, ...icoImages]));

console.log("Ícones da aplicação gerados a partir de public/favicon.png.");
