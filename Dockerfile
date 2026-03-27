# -----------------------------------------------------------------------------
# Suno Consultoria — site estático
# Build: SCSS (src/scss) → dist/ (CSS minificado + HTML, img, JS, PDFs)
# Runtime: nginx servindo apenas dist/
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Dependências primeiro (cache de layer)
COPY package.json package-lock.json ./
RUN npm ci

# Código-fonte necessário ao build
COPY src/scss ./src/scss
COPY scripts ./scripts
COPY index.html nossa-equipe.html termos-e-condicoes.html ./
COPY script.js site.webmanifest robots.txt sitemap.xml ./
COPY img ./img
COPY documentos-legais ./documentos-legais

RUN npm run build

# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="Suno Consultoria (estático)" \
      org.opencontainers.image.description="Site estático gerado a partir de SCSS + HTML"

# Artefacto final: apenas o que o deploy precisa
COPY --from=builder /app/dist /usr/share/nginx/html

# Bloquear acesso HTTP a /docs/ e ficheiros sob essa rota (403)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
