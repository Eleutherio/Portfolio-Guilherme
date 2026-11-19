import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const directory = fileURLToPath(new URL("../src/assets/projects/", import.meta.url));
const slugs = ["grengame", "abriu-chaveiro", "martha-izabel"];
// Match the desktop player's initial timestamp, avoiding the recordings' blank opening frame.
const startTime = 0.1;
const videos = new Map(
  await Promise.all(
    slugs.map(async (slug) => [
      `/${slug}.mp4`,
      await readFile(path.join(directory, `${slug}-preview.mp4`)),
    ]),
  ),
);
const server = createServer((request, response) => {
  const video = videos.get(request.url);
  response.setHeader("Content-Type", video ? "video/mp4" : "text/html");
  response.end(video ?? "<!doctype html><title>Project poster generation</title>");
});
let browser;
try {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  for (const slug of slugs) {
    const frame = await page.evaluate(
      async ({ slug, startTime }) => {
        const video = document.createElement("video");
        video.muted = true;
        video.src = `/${slug}.mp4`;
        document.body.append(video);
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = resolve;
          video.onerror = () => reject(new Error(`Cannot load ${slug}`));
        });
        await new Promise((resolve) => {
          video.onseeked = resolve;
          video.currentTime = startTime;
        });
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        video.remove();
        return canvas.toDataURL("image/png").split(",")[1];
      },
      { slug, startTime },
    );
    const source = sharp(Buffer.from(frame, "base64"));
    const [webp, avif] = await Promise.all([
      source.clone().webp({ quality: 90, effort: 6, smartSubsample: true }).toBuffer(),
      source.clone().avif({ quality: 65, effort: 6 }).toBuffer(),
    ]);
    await Promise.all([
      writeFile(path.join(directory, `${slug}-preview-poster.webp`), webp),
      writeFile(path.join(directory, `${slug}-preview-poster.avif`), avif),
    ]);
    console.log(`${slug}: AVIF ${avif.length} bytes; WebP ${webp.length} bytes`);
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
