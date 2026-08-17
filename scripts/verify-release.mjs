import { appendFile } from "node:fs/promises";
import { verifyRelease } from "./release-verifier.mjs";

const result = await verifyRelease();
console.info(
  `[release] Pages ${result.frontendCommit} and Render ${result.apiCommit} verified at ${result.verifiedAt}`,
);

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  await appendFile(
    summaryPath,
    [
      "## Verificação de release",
      "",
      `- Commit do Cloudflare Pages: \`${result.frontendCommit}\``,
      `- Commit do Render: \`${result.apiCommit}\``,
      `- Cloudflare Pages: \`${result.frontendOrigin}\``,
      `- Render: \`${result.apiOrigin}\``,
      `- Verificado em: \`${result.verifiedAt}\``,
      "",
    ].join("\n"),
    "utf8",
  );
}
