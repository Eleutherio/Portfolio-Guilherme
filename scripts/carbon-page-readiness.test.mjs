import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { chromium } from "playwright";
import { waitForCarbonPage } from "./carbon-page-readiness.mjs";

test("prontidão aguarda reveal e independe de transferência contínua", async () => {
  const sockets = new Set();
  const server = createServer((request, response) => {
    if (request.url === "/stream") {
      response.writeHead(200, { "Content-Type": "application/octet-stream" });
      response.write("ongoing");
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end('<main></main><div id="site-preloader"></div><script>fetch("/stream");</script>');
  });
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const response = page.waitForResponse((response) => response.url().endsWith("/stream"));
    await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: "domcontentloaded" });
    const stream = await response;
    await assert.rejects(waitForCarbonPage(page, 200), /Timeout/);
    await page.evaluate(() => {
      document.documentElement.dataset.pagePrepared = "true";
      document.documentElement.dataset.pageRevealed = "true";
    });
    // O loader ainda presente deve impedir a medição mesmo com os flags.
    await assert.rejects(waitForCarbonPage(page, 200), /Timeout/);
    await page.evaluate(() => document.querySelector("#site-preloader").remove());
    await waitForCarbonPage(page, 2_000);
    assert.equal(stream.status(), 200);
    assert.equal(
      await Promise.race([
        stream.finished().then(() => "finished"),
        new Promise((resolve) => setTimeout(() => resolve("pending"), 100)),
      ]),
      "pending",
    );
  } finally {
    await browser?.close();
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  }
});
