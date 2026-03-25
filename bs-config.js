/**
 * Browser-sync — evita “piscar” ao editar SCSS:
 * mudanças em main.css são injetadas sem reload completo da página.
 * HTML/JS continuam com reload normal (com debounce).
 */
module.exports = {
  server: {
    baseDir: ".",
    index: "index.html",
  },
  files: ["main.css", "index.html", "nossa-equipe.html", "termos-e-condicoes.html", "script.js"],
  watchOptions: {
    ignoreInitial: true,
    ignored: ["node_modules"],
  },
  port: 5173,
  open: "local",
  notify: false,
  injectChanges: true,
  reloadDelay: 100,
  reloadDebounce: 400,
};
