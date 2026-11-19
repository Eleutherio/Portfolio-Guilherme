// Streams e integrações em segundo plano não definem prontidão visual da aplicação.
export async function waitForCarbonPage(page, timeout = 60_000) {
  await page.waitForFunction(
    () =>
      document.documentElement.dataset.pagePrepared === "true" &&
      document.documentElement.dataset.pageRevealed === "true" &&
      !document.querySelector("#site-preloader") &&
      Boolean(document.querySelector("main")),
    undefined,
    { timeout },
  );
}
