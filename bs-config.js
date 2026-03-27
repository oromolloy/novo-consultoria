/**
 * Browser-sync — evita “piscar” ao editar SCSS:
 * mudanças em css/main.css são injetadas sem reload completo da página.
 * HTML/JS continuam com reload normal (com debounce).
 */
module.exports = {
  server: {
    baseDir: ".",
    index: "index.html",
  },
  // Alinhado ao nginx em produção: /docs/ não é servido (403)
  middleware: [
    function blockDocs(req, res, next) {
      const pathOnly = (req.url || "").split("?")[0];
      if (/^\/docs(\/|$)/i.test(pathOnly)) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Forbidden");
        return;
      }
      next();
    },
  ],
  files: [
    "css/main.css",
    "index.html",
    "nossa-equipe.html",
    "termos-e-condicoes.html",
    "script.js",
    "img/**/*",
  ],
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
