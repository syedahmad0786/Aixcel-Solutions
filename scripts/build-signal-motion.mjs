import { build } from "esbuild";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");

await build({
  entryPoints: [resolve(repo, "site", "assets", "signal-motion.jsx")],
  outfile: resolve(repo, "site", "assets", "signal-motion.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2022"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  sourcemap: false,
});

console.log("Built the SIGNAL Motion for React island.");
