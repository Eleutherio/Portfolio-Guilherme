(() => {
  const preloader = document.getElementById("site-preloader");
  const wordmark = preloader?.querySelector("[data-preloader-wordmark]");
  const wordmarkFer = preloader?.querySelector("[data-preloader-fer]");
  const wordmarkTech = preloader?.querySelector("[data-preloader-tech]");

  if (
    !(preloader instanceof HTMLElement) ||
    !(wordmark instanceof HTMLElement) ||
    !(wordmarkFer instanceof HTMLElement) ||
    !(wordmarkTech instanceof HTMLElement)
  ) {
    return;
  }

  const target = "fer.tech";
  const root = document.getElementById("root");
  if (root) {
    root.inert = true;
    root.setAttribute("aria-busy", "true");
  }
  document.documentElement.dataset.pageLoading = "true";
  const retry = preloader.querySelector(".site-preloader__retry");
  retry?.addEventListener("click", () => window.location.reload());
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 16;
  let animationTimer = 0;
  let removalTimer = 0;

  const randomCharacter = () => characters[Math.floor(Math.random() * characters.length)] ?? "g";

  const scrambled = (value) =>
    Array.from(value, (character) => (character === "." ? character : randomCharacter())).join("");

  const updateSuffix = (value) => {
    wordmarkFer.textContent = value.slice(0, 3);
    wordmarkTech.textContent = value.slice(3);
  };

  if (!reducedMotion) {
    animationTimer = window.setInterval(() => {
      frame = (frame + 1) % 34;

      if (frame < 6) {
        updateSuffix(scrambled(target));
        return;
      }

      if (frame < 6 + target.length) {
        const stableLength = frame - 5;
        const frontierEnd = Math.min(target.length, stableLength + 2);
        updateSuffix(
          target.slice(0, stableLength) + scrambled(target.slice(stableLength, frontierEnd)),
        );
        return;
      }

      updateSuffix(target);
    }, 70);
  }

  const complete = () => {
    if (preloader.dataset.complete === "true" || preloader.dataset.state === "error") return;
    if (animationTimer) window.clearInterval(animationTimer);
    updateSuffix(target);
    preloader.dataset.complete = "true";
    removalTimer = window.setTimeout(
      () => {
        preloader.remove();
        if (root) {
          root.inert = false;
          root.removeAttribute("aria-busy");
        }
        document.documentElement.dataset.pageLoading = "false";
        document.documentElement.dataset.pageRevealed = "true";
        window.dispatchEvent(new Event("portfolio:page-revealed"));
      },
      reducedMotion ? 0 : 220,
    );
  };

  const fail = () => {
    if (animationTimer) window.clearInterval(animationTimer);
    updateSuffix(target);
    const portuguese = document.documentElement.lang.startsWith("pt");
    const message = preloader.querySelector(".site-preloader__message");
    if (message)
      message.textContent = portuguese
        ? "Não foi possível preparar a página. Tente novamente."
        : "The page could not be prepared. Please try again.";
    if (retry) {
      retry.hidden = false;
      retry.textContent = portuguese ? "Recarregar página" : "Reload page";
    }
    preloader.dataset.state = "error";
  };
  window.addEventListener("portfolio:page-prepared", complete, { once: true });
  window.addEventListener("portfolio:page-preparation-error", fail);
  window.addEventListener("unhandledrejection", () => {
    if (preloader.isConnected && preloader.dataset.complete !== "true") fail();
  });
  window.addEventListener(
    "error",
    (event) => {
      if (event.target instanceof HTMLScriptElement) fail();
    },
    true,
  );
  if (document.documentElement.dataset.pagePrepared === "true") complete();

  window.addEventListener(
    "pagehide",
    () => {
      if (animationTimer) window.clearInterval(animationTimer);
      if (removalTimer) window.clearTimeout(removalTimer);
    },
    { once: true },
  );
})();
