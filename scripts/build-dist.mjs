/**
 * Build de produção: CSS minificado em dist/css/main.css + cópia de assets estáticos.
 * Caminhos relativos no HTML (img/, css/, script.js) mantêm-se válidos dentro de dist/.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "css"), { recursive: true });

const scssEntry = path.join(root, "src", "scss", "main.scss");
const cssOut = path.join(dist, "css", "main.css");

execSync(`npx sass "${scssEntry}" "${cssOut}" --style=compressed --no-source-map`, {
    stdio: "inherit",
    cwd: root,
    shell: true,
});

const copyFiles = [
    "index.html",
    "nossa-equipe.html",
    "termos-e-condicoes.html",
    "script.js",
    "site.webmanifest",
    "robots.txt",
    "sitemap.xml",
];

for (const name of copyFiles) {
    const from = path.join(root, name);
    if (!existsSync(from)) continue;
    await cp(from, path.join(dist, name));
}

const copyDirs = ["img", "documentos-legais"];
for (const name of copyDirs) {
    const from = path.join(root, name);
    if (!existsSync(from)) continue;
    await cp(from, path.join(dist, name), { recursive: true });
}

console.log("Build dist concluído: dist/css/main.css (minificado) + HTML, JS, img, documentos-legais.");
