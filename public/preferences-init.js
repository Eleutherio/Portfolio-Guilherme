(function () {
  // Este contrato espelha src/lib/preferences.ts. O script permanece clássico e externo para
  // executar antes da primeira pintura sem exigir `unsafe-inline` na CSP.
  var language = "pt";
  var theme = "light";

  try {
    var storedLanguage = window.localStorage.getItem("gf-lang");
    var storedTheme = window.localStorage.getItem("gf-theme");
    if (storedLanguage === "en" || storedLanguage === "pt") language = storedLanguage;
    if (storedTheme === "dark" || storedTheme === "light") theme = storedTheme;
  } catch {
    // As preferências padrão já estão refletidas no documento.
  }

  var root = document.documentElement;
  root.lang = language === "pt" ? "pt-BR" : "en";
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;
})();
