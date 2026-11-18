import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const root = process.cwd();
const videoPath = path.join(root, "src/assets/hero/hero-background.mp4");
const outputPath = path.join(root, "src/assets/hero/hero-background-poster-1200w.avif");
const videoUrl = process.env.HERO_VIDEO_URL ?? pathToFileURL(videoPath).href;
const targetBytes = 10 * 1024;
const sourceTimeSeconds = Number(process.env.HERO_POSTER_TIME_SECONDS ?? "0");

const browser = await chromium.launch({
  headless: true,
  args: ["--allow-file-access-from-files"],
});

try {
  const page = await browser.newPage();
  if (videoUrl.startsWith("http")) {
    await page.goto(new URL("/", videoUrl).href, { waitUntil: "domcontentloaded" });
  }
  await page.setContent('<video id="source" muted playsinline></video>');
  const frame = await page.evaluate(
    async ({ source, sourceTimeSeconds }) => {
      const video = document.querySelector("#source");
      if (!(video instanceof HTMLVideoElement)) throw new Error("Video element unavailable");
      video.src = source;
      await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", resolve, { once: true });
        video.addEventListener("error", () => reject(video.error), { once: true });
      });

      const seek = async (time) => {
        video.currentTime = time;
        await new Promise((resolve) => video.addEventListener("seeked", resolve, { once: true }));
      };
      await seek(sourceTimeSeconds);
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas context unavailable");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      return {
        dataUrl: canvas.toDataURL("image/png"),
        time: sourceTimeSeconds,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      };
    },
    { source: videoUrl, sourceTimeSeconds },
  );

  const png = Buffer.from(frame.dataUrl.split(",")[1], "base64");
  if (process.env.HERO_POSTER_INSPECT === "1") {
    const { dataUrl: _dataUrl, ...metadata } = frame;
    console.log(JSON.stringify(metadata, null, 2));
    await browser.close();
    process.exit(0);
  }

  let minimumQuality = 10;
  let maximumQuality = 90;
  let quality = minimumQuality;
  let poster = Buffer.alloc(0);
  while (minimumQuality <= maximumQuality) {
    const candidateQuality = Math.floor((minimumQuality + maximumQuality) / 2);
    const candidate = await sharp(png)
      .resize({ width: 1200, withoutEnlargement: true })
      .avif({ quality: candidateQuality, effort: 9 })
      .toBuffer();
    if (candidate.length <= targetBytes) {
      quality = candidateQuality;
      poster = candidate;
      minimumQuality = candidateQuality + 1;
    } else {
      maximumQuality = candidateQuality - 1;
    }
  }
  if (poster.length === 0) {
    throw new Error(`Poster exceeds ${targetBytes} bytes at minimum quality`);
  }

  await writeFile(outputPath, poster);
  console.log(
    JSON.stringify({
      outputPath,
      sourceTimeSeconds: Number(frame.time.toFixed(2)),
      sourceDimensions: `${frame.width}x${frame.height}`,
      bytes: poster.length,
      quality,
    }),
  );
} finally {
  await browser.close();
}
