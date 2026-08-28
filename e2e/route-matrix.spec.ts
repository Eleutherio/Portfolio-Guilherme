import { MODES, openPage, ROUTES, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — matriz de rotas", () => {
  for (const route of ROUTES) {
    for (const mode of MODES) {
      test(`${route} | ${mode.language} | ${mode.theme} | ${mode.viewport}`, async ({
        page,
      }, testInfo) => {
        const mobile = mode.viewport === "mobile";
        await openPage(page, route, {
          language: mode.language,
          theme: mode.theme,
          width: mobile ? 375 : 1440,
          height: 900,
        });
        await runAxe(page, testInfo, "default");
      });
    }
  }
});
