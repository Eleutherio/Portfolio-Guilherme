import sharp from "sharp";
import { fileURLToPath } from "node:url";
// Snapshot do selo publicado; o link de verificação continua apontando ao relatório vivo.
await sharp(fileURLToPath(new URL("./assets/green-hosting.png", import.meta.url)))
  .webp({ quality: 92, effort: 6, smartSubsample: true })
  .toFile(fileURLToPath(new URL("../public/images/green-hosting.webp", import.meta.url)));
