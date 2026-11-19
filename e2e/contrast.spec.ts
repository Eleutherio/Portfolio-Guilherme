import {
  compositeColor,
  contrastRatio,
  expect,
  openPage,
  parseHexColor,
  serializeRgb,
  test,
} from "./support/portfolio";

test.describe("WCAG 2.2 AA — contraste manual dos gradientes", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`${theme}: tokens textuais, controles, botões e depoimentos`, async ({ page }) => {
      await openPage(page, "/", {
        theme,
        width: 1440,
        height: 900,
        loadDeferredSections: false,
      });

      const names = [
        "--background",
        "--home-alternate",
        "--surface",
        "--home-card",
        "--foreground",
        "--muted-foreground",
        "--accent",
        "--accent-2",
        "--accent-foreground",
        "--destructive",
        "--success",
        "--control-border",
        "--footer-bg",
        "--footer-foreground",
        "--footer-muted",
      ];
      const tokens = await page.locator(".home-visual").evaluate((element, properties) => {
        const styles = getComputedStyle(element);
        return Object.fromEntries(
          properties.map((property) => [property, styles.getPropertyValue(property)]),
        );
      }, names);
      const color = (name: string) => parseHexColor(tokens[name]);
      const backgrounds = ["--background", "--home-alternate", "--surface", "--home-card"];
      const textColors = [
        "--foreground",
        "--muted-foreground",
        "--accent",
        "--accent-2",
        "--destructive",
        "--success",
      ];

      for (const textColor of textColors) {
        for (const background of backgrounds) {
          expect(
            contrastRatio(color(textColor), color(background)),
            `${theme}: ${textColor} sobre ${background}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }

      for (const endpoint of ["--accent", "--accent-2"]) {
        expect(
          contrastRatio(color("--accent-foreground"), color(endpoint)),
          `${theme}: texto do botão sobre ${endpoint}`,
        ).toBeGreaterThanOrEqual(4.5);
      }

      for (const background of backgrounds) {
        expect(
          contrastRatio(color("--control-border"), color(background)),
          `${theme}: limite do controle sobre ${background}`,
        ).toBeGreaterThanOrEqual(3);
      }

      expect(
        contrastRatio(color("--footer-foreground"), color("--footer-bg")),
      ).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(color("--footer-muted"), color("--footer-bg"))).toBeGreaterThanOrEqual(
        4.5,
      );

      const thanksColors = await page.locator(".footer-thanks").evaluate((element) => ({
        text: getComputedStyle(element).color,
        background: getComputedStyle(element.closest("footer")!).backgroundColor,
      }));
      const rgb = (value: string) =>
        value
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number) as [number, number, number];
      expect(
        contrastRatio(rgb(thanksColors.text), rgb(thanksColors.background)),
        `${theme}: agradecimento renderizado`,
      ).toBeGreaterThanOrEqual(4.5);

      const testimonialMuted = compositeColor(color("--foreground"), color("--background"), 0.65);
      expect(
        contrastRatio(testimonialMuted, color("--background")),
        `${theme}: metadados dos depoimentos a 65%`,
      ).toBeGreaterThanOrEqual(4.5);

      await page.evaluate(() => {
        window.dispatchEvent(
          new CustomEvent("portfolio:load-deferred-section", { detail: "depoimentos" }),
        );
      });
      const testimonialSection = page.locator("#depoimentos");
      await expect(testimonialSection).toBeAttached();
      await expect(
        testimonialSection.locator(".testimonial-editorial-quote-mark").first(),
      ).toBeAttached();
      const testimonialColors = await testimonialSection.evaluate((section) => {
        const root = getComputedStyle(section);
        const quote = getComputedStyle(
          section.querySelector<HTMLElement>(".testimonial-editorial-quote-mark")!,
        );
        const rule = getComputedStyle(
          section.querySelector<HTMLElement>(".section-editorial-rule")!,
        );
        return {
          background: root.backgroundColor,
          backgroundToken: root.getPropertyValue("--background").trim(),
          accentToken: root.getPropertyValue("--accent").trim(),
          quote: quote.color,
          rule: rule.backgroundColor,
        };
      });
      expect(testimonialColors.background).toBe(
        serializeRgb(parseHexColor(testimonialColors.backgroundToken)),
      );
      expect(testimonialColors.quote).toBe(
        serializeRgb(parseHexColor(testimonialColors.accentToken)),
      );
      expect(testimonialColors.rule).toBe(
        serializeRgb(parseHexColor(testimonialColors.accentToken)),
      );

      await page.evaluate(() => {
        window.dispatchEvent(
          new CustomEvent("portfolio:load-deferred-section", { detail: "contato" }),
        );
      });
      const contactName = page.locator("#contact-name");
      await expect(contactName).toBeAttached();
      await contactName.scrollIntoViewIfNeeded();
      await contactName.fill("A");
      await page.locator("#contact-email").fill("email-invalido");
      await page.locator("#contact-message").fill("curta");
      await page.locator("#contact-privacy-consent").check();
      await page.locator('#contato button[type="submit"]').click();

      const alerts = page.locator('#contato [role="alert"]');
      await expect(alerts).toHaveCount(3);
      for (const alert of await alerts.all()) {
        await expect(alert).toHaveCSS("color", serializeRgb(color("--destructive")));
        await expect(alert).toHaveCSS("opacity", "1");
      }
      for (const label of await page.locator("#contato label[for]").all()) {
        await expect(label).toHaveCSS("color", serializeRgb(color("--muted-foreground")));
      }
    });
  }
});
