# Contexto do Projeto — Novo Consultoria

**Documento único:** contexto do repositório e padronização (antes dispersos em outros `.md`). Swiper: resumo na **§8**; detalhe de código em `script.js` e nos SCSS dos blocos.

---

## Instrução para o assistente (IA)

**Quando o usuário pedir para "atualizar o arquivo de contexto" (ou equivalente):**

1. **Ler** o `CONTEXTO-PROJETO.md` atual.
2. **Incorporar** no documento tudo que mudou ou foi combinado na conversa: novas seções, convenções, ficheiros, padrões, estrutura, imagens, JS, sliders, etc.
3. **Atualizar** a seção **"Histórico de atualizações (contexto)"** no final: data e resumo breve.
4. **Manter** a estrutura geral e a numeração coerente.

Objetivo: contexto sempre atual entre sessões.

---

Arquivo de memória para manter contexto entre sessões.

---

## 1. Estrutura do projeto

- **HTML:** `index.html` (home), `nossa-equipe.html`, `termos.html`.
- **CSS:** SCSS compilado para `main.css`. Um ficheiro SCSS por seção/bloco.
- **Nomes dos ficheiros `.scss`:** **kebab-case em inglês**, espelhando o **bloco BEM em camelCase inglês** (ex.: `who-we-are.scss` → `.whoWeAre`, `video-testimonials.scss` → `.videoTestimonials`). Não usar camelCase no nome do ficheiro.
- **JS:** `script.js` (vanilla); Swiper 12 via CDN.
- **Imagens:** `img/` (logo SVG, pasta `img/equipe/` para fotos da secção team, etc.).

### npm — build e hot reload

**Ficheiros na raiz (tooling):** `package.json`, `package-lock.json` (manter no Git para installs reprodutíveis), **`bs-config.js`** (Browser-sync), **`.gitignore`** (inclui `node_modules/`).

**Primeira vez (ou após clonar o repositório):**

```bash
npm install
```

**Scripts (`package.json`):**

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Compila uma vez: `main.scss` → `main.css` (sem source map). |
| `npm run build:prod` | CSS **comprimido** (`compressed`), sem source map. |
| `npm run watch` | Só **Sass em watch** (`main.scss` → `main.css`). |
| `npm run hot` | Em paralelo: `watch` + **Browser-sync 3** com **`bs-config.js`**. |
| `npm run dev` | Alias de `npm run hot`. |

**Fluxo típico de desenvolvimento:**

```bash
npm run hot
```

Abre o browser na URL indicada no terminal (porta **5173** por defeito; se estiver ocupada, o Browser-sync usa a seguinte livre, ex. 5174).

**`bs-config.js` (Browser-sync):**

| Opção | Função |
|-------|--------|
| `server.baseDir` / `index` | Serve a raiz do projeto; entrada `index.html`. |
| `files` | **`main.css`**, **`index.html`**, **`nossa-equipe.html`**, **`termos.html`**, **`script.js`**. |
| `watchOptions` | `ignoreInitial: true`; `ignored: node_modules`. |
| `injectChanges` | **Injeção de CSS** quando `main.css` muda (sem reload completo → menos “piscar” ao editar SCSS). |
| `reloadDelay` / `reloadDebounce` | Atraso e debounce nos reloads (útil quando HTML/JS mudam). |
| `notify` | `false` — sem toast no canto do browser. |

Alterações em **HTML** ou **`script.js`** continuam a provocar **reload normal** da página.

**Dependências de desenvolvimento:** `sass`, `browser-sync` (^3.x), `concurrently`.

**Dica:** para reload automático ao trocar imagens, podes acrescentar `"img/**/*"` ao array `files` em `bs-config.js`. Antes de commit/deploy sem usar `hot`, corre **`npm run build`** (ou `build:prod`) para garantir `main.css` atualizado.

### Ficheiros SCSS principais

| Ficheiro | Conteúdo |
|----------|----------|
| `variables.scss` | Variáveis globais (margens, fontes). |
| `mixin.scss` | Mixins reutilizáveis (`endOfModule`, `swiperNavChevron`, etc.). |
| `animations.scss` | Apenas `@keyframes`. |
| `main.scss` | Ponto único: `@use` variables → mixin → animations → common-elements → módulos por secção → reset, `:root`, tipografia, `.wrapper`. |
| `common-elements.scss` | `.sectionHeader`, `.btn-primary`, `.btn-secondary`. |
| `section-header-with-sidebar.scss` | Mídia e sidebar em `sectionHeader--withStickySidebar`. |
| Demais módulos | `header`, `hero`, `who-we-are`, `services`, `values`, `method`, `testimonials`, `video-testimonials`, `you-center`, `why-suno`, `team`, `structure`, `faq`, `contact`, `page-hero`, `legal-documents`, `footer`, `hide`. |

---

## 2. Ordem de imports no `main.scss`

```scss
@use "variables" as *;
@use "mixin" as *;
@use "animations" as *;
@use "common-elements" as *;
@use "section-header-with-sidebar" as *;
@use "header" as *;
@use "hero" as *;
@use "who-we-are" as *;
@use "services" as *;
@use "values" as *;
@use "method" as *;
@use "testimonials" as *;
@use "video-testimonials" as *;
@use "you-center" as *;
@use "why-suno" as *;
@use "team" as *;
@use "structure" as *;
@use "faq" as *;
@use "contact" as *;
@use "page-hero" as *;
@use "legal-documents" as *;
@use "footer" as *;
@use "hide" as *;
// Depois: reset, :root, tipografia, .wrapper
```

Manter essa ordem ao adicionar novos módulos.

---

## 3. Variáveis (`variables.scss`)

```scss
$marginDesk: 64px;
$marginMobi: 32px;
$usedFont: Arial, Helvetica, sans-serif;
$titleFont: "Montserrat", "Arial", sans-serif;
```

- **Variáveis CSS** em `main.scss` (`:root`): `--color-txt`, `--color-primary`, `--color-dark`, `--hat-filter-light`, `--hat-filter-dark`, etc.
- **Hat (`sectionHeader__hat`) — contraste WCAG:** base `#000` (fundo claro) ou `#fff` (`.sectionHeader--dark`) + `filter: var(--hat-filter-*)` definidos em `:root`.

---

## 4. Mixins (`mixin.scss`)

| Mixin | Uso |
|-------|-----|
| `@include endOfModule` | Margem inferior: `$marginDesk` em `min-width: 801px`, `$marginMobi` em `max-width: 800px`. |
| `swiperNavChevron` | Botões prev/next do Swiper: esconde SVG interno do Swiper 12 e o `::after` padrão; seta única em `::before` (data-URI). Incluir com `@include swiperNavChevron` nos seletores `--team`, `--whySuno`, etc. |
| `resume($lineToResume: 3)` | `-webkit-line-clamp` + reticências. |
| `grid($numberGrid)` | `grid-template-columns: repeat(N, 1fr)`. |
| `gridGap($numberGap)` | Gaps de grid. |
| `border($numberRadius)` | `border-radius`. |
| `list-style-none` | Remove marcador de lista / `details`. |
| `center` | Flex centralizado. |
| `debug()` | Apenas desenvolvimento. |

---

## 5. Animações (`animations.scss`)

- **radarPulse**, **radarWave** (hero).
- **cardFloatLeft** / **cardFloatRight**, **cardSlideInLeft** / **cardSlideInRight**.

Sem mixins de animação; uso direto nos módulos.

---

## 6. Common-elements

- **`.sectionHeader`** — `__img`, `__hat`, `__title`, `__desc`. Modificadores: `--noImg`, `--dark`, `--withStickySidebar` (grid 2 colunas; sticky da sidebar em ≥1221px quando aplicável).
- **Coluna sticky:** não usar `overflow-x: hidden` no bloco em viewports grandes (quebra o sticky). Usar `overflow-x: hidden` só em `max-width: 1220px` (layout 1 coluna). Blocos com esse padrão: **whoWeAre**, **method** (`method__content`), **you-center** (`you-center__models`).
- **`.btn-primary` / `.btn-secondary`** — seta do primário em `::after`; `&:has(svg)` esconde o `::after` se existir `<svg>` no botão.

---

## 7. Padrão de SVG (ícones)

- **Sem SVG inline no HTML** para ícones (exceto logo: `<img src="img/suno-consultoria.svg">`).
- **Ícones:** elemento vazio + **SVG em CSS** (`background-image: data-uri` em `::before`/`::after`). Cores: `%23` em vez de `#`.
- **Footer:** sprite `img/footer/social-icons.svg` com `<svg><use href="...#id"></use></svg>`.

---

## 8. Sliders (Swiper 12) — resumo

Biblioteca **Swiper 12** via CDN: CSS no `<head>`, JS **antes** de `script.js`. Implementação completa (opções, destroy/init, breakpoints) em **`script.js`**. Markup e classes por bloco em **`index.html`**.

| Bloco | Secção | `mySwiper--*` | Nota |
|-------|--------|---------------|------|
| Depoimentos (texto) | `.testimonials` | `--testimonials` | Sempre ativo; ≤800px reorganiza 1 card/slide. |
| Nossa equipe | `.team` | `--team` | Só ≤800px; acima = grid CSS; nav oculta >800px. |
| Por que a Suno | `.whySuno` | `--whySuno` | Sempre; 2 slides a partir do breakpoint 760px (Swiper). |
| Estrutura | `.structure` | `--structure` | Coverflow, `slidesPerView: 'auto'`. |
| Depoimentos em vídeo | `.videoTestimonials` | `--videoTestimonials` | Loop, autoplay; nav em `__navigation`. |

**SCSS:** botões prev/next com **`@include swiperNavChevron`** (ver **§4**). Restantes regras (flex, bullets, tamanhos) nos `.scss` de cada bloco.

**Bleed mobile** (`width: calc(100% + 16px)` em ≤800px): só **`.team__list .swiper`** e **`.videoTestimonials__sliderWrap .swiper`**.

**Novo slider:** seguir o padrão dos blocos existentes + linha do checklist em **§16**.

---

## 9. BEM e nomenclatura

- **Blocos:** camelCase (ex.: `.sectionHeader`, `.videoTestimonials`, `.team`).
- **Elementos:** `__elemento` (ex.: `team__card`, `structure__slideImg`).
- **Modificadores:** `--modificador` (ex.: `team__consultor--more`).
- **Estados:** pseudo-classes no CSS; evitar classes de estado no HTML.

Sincronizar classes entre HTML/SCSS (e PHP/WordPress no futuro).

---

## 10. Media queries

- **Breakpoints principais:** **1220px** e **800px**.
- **760px:** usar **apenas aninhado dentro do ramo de 800px** quando for preciso um passo extra fino (tipografia, padding, bullets, etc.) — **não** duplicar `@media 800` incorretamente dentro do mesmo ramo.
- **Ordem:** maior → menor (**1220 → 800 → 760** quando 760 existir).
- **Posição:** sempre **dentro** do seletor/bloco a que se referem.
- Abordagem: **max-width** em cascata (não mobile-first).

```scss
.bloco {
  padding: 80px 0;
  @media screen and (max-width: 1220px) {
    padding: 64px 0;
    @media screen and (max-width: 800px) {
      padding: 52px 0;
      @media screen and (max-width: 760px) {
        padding: 48px 0;
      }
    }
  }
}
```

---

## 11. Acessibilidade e semântica

- Header: `role="banner"`; nav `aria-label="Navegação principal"`.
- Main: `role="main"`. Footer: `role="contentinfo"`.
- Secções: `aria-label` descritivo.
- Footer: `<address>`; `<nav aria-label="Links úteis">` / redes.
- **You-center:** passos em `<article class="you-center__step">`.
- **Team “Ver mais consultores”:** links para `#team-consultores-expand` e âncora de retorno; expansão com `:target` em CSS.
- Imagens: `alt` adequado; foco e contraste em controlos.

---

## 12. Imagens

### Pasta `img/` (trecho)

```
img/
├── suno-consultoria.svg
├── nossos-servicos.avif / .png / .webp
├── carteiras/          # gráficos Por que a Suno
├── equipe/             # fotos .avif (classes BEM: team__cardImg)
└── footer/
    ├── cvm-logo.svg
    └── social-icons.svg  # #instagram, #youtube, #facebook, #x, #linkedin
```

### Convenções

- Preferir **AVIF**; `width`/`height` para **CLS**; `loading="lazy"` abaixo da dobra (exceto LCP).
- **Structure:** slides podem usar URLs externas em `.structure__slideImg`.
- **Why Suno:** legendas (dots) alinhadas às cores das linhas nos PNGs (`whySuno__cardLegendDot--*`).

---

## 13. JavaScript (`script.js`)

| Bloco | Função |
|-------|--------|
| **Hero — números** | `IntersectionObserver` + animação de contadores em `.hero__content__statNumber`. |
| **Testimonials** | `reorganizeSlides()` + Swiper; resize com debounce 250 ms. |
| **Team** | `initTeamSwiper()` só ≤800px; destroy + reinit no resize (debounce). |
| **Why Suno** | Swiper sempre; `update()` no resize (debounce). |
| **Structure** | Coverflow; `update()` no resize (debounce). |
| **Video testimonials** | Swiper + autoplay/loop; `update()` no resize; modal de vídeo (se ativo no HTML). |

Convenções: comentários `// ========== NOME - INÍCIO / FIM ==========`; seletores por classes BEM.

---

## 14. Performance e Core Web Vitals

- LCP, CLS, FID/INP: imagens dimensionadas, menos JS desnecessário, animações em CSS quando possível.
- Swiper só onde faz sentido (team só mobile).

---

## 15. Blocos adicionais

- **`.pageHero`** — páginas internas (termos, etc.): `page-hero.scss`, snippet `pageHero-snippet.html`.
- **`.contact`** — formulário HubSpot, grid responsivo, `contact.scss`; âncora `#contact`, `#contact-form`.
- **`.you-center`** — atendimento: grid 2 colunas, sticky em `__models` (≥1221px), pills e cards com ícones em CSS.

---

## 16. Checklist rápido (reutilizável)

- [ ] Ficheiros `.scss` em **kebab-case inglês** alinhados ao bloco **camelCase inglês**; elementos `__elemento`; modificadores `--modificador`.
- [ ] Media queries **1220 → 800 → (760 aninhado)** dentro do elemento.
- [ ] SVG: ícones em CSS (data-URI); `%23` no lugar de `#`.
- [ ] Sticky: sem `overflow-x: hidden` no bloco em desktop largo; overflow só ≤1220px se necessário.
- [ ] Swiper: `mySwiper--[mod]` + navegação com mesmo sufixo; `@include swiperNavChevron`; checagem `typeof Swiper` e debounce no resize quando aplicável.
- [ ] Imagens: `width`/`height`, `alt`, lazy quando adequado.
- [ ] HTML semântico; roles/`aria-label` onde couber.
- [ ] Antes de commit/entrega: **`npm run build`** (ou `build:prod`) se o CSS tiver sido editado só em `.scss`.

---

## 17. Histórico de atualizações (contexto)

- **Criação** — Estrutura inicial: main, common-elements, SVG, sliders, BEM, media queries, CWV.
- **Evolução** — Secções Imagens e JavaScript; footer; pageHero e contact; padrão sticky; ficheiros e blocos em inglês (`whoWeAre`, `whySuno`, `videoTestimonials`, `team`, `structure`, `contact`); timeline em `you-center.scss`.
- **25/02/2026** — Fusão `PADRONIZACAO.md` + `SLIDER-SWIPER-ANALISE.md` neste ficheiro (ficheiros antigos removidos). Código: cinco sliders, `swiperNavChevron`, bleed só team/video, módulos em inglês. **§8 Swiper** enxuta: só tabela-resumo e remissões a `script.js` / HTML / **§4** / **§16** (sem bloco analítico duplicado).
- **25/02/2026** — **Tooling npm:** `package.json`, **`bs-config.js`** (Browser-sync), **`.gitignore`**. **`npm run hot`:** Sass watch + Browser-sync (`injectChanges`, debounce). HTML carrega **`script.js`** direto (sem bundle).
- **25/02/2026** — Reversão experimental de rolagem suave / esbuild: estado alinhado ao fluxo simples acima.

---

*Atualize este ficheiro ao fechar etapas relevantes ou quando pedido explicitamente.*
