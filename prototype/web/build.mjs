/* Construye un index.html AUTOCONTENIDO incrustando CSS + Three.js + app.js.
   Uso:  node build.mjs   (desde prototype/web/) */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const r = (p) => readFileSync(join(here, p), "utf8");

const template = r("src/template.html");
const css = r("src/style.css");
const three = r("lib/three.min.js");
const app = r("src/app.js");

// Reemplazo simple por marcadores (sin tocar $ ni similares).
const out = template
  .replace("/* @@STYLE@@ */", () => css)
  .replace("/* @@THREE@@ */", () => three)
  .replace("/* @@APP@@ */", () => app);

writeFileSync(join(here, "index.html"), out);
console.log("index.html generado:", out.length, "bytes");
