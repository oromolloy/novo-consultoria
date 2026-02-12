# Contexto do Projeto — Novo Consultoria

---

## Instrução para o assistente (IA)

**Quando o usuário pedir para "atualizar o arquivo de contexto" (ou "atualize seu arquivo de contexto", "atualiza o md de contexto", etc.):**

1. **Ler** o `CONTEXTO-PROJETO.md` atual.
2. **Incorporar** no documento tudo que mudou ou foi combinado na conversa: novas seções, convenções alteradas, novos arquivos, padrões novos, mudanças em estrutura, imagens, JS, sliders, etc.
3. **Atualizar** a seção **"Histórico de atualizações (contexto)"** no final do arquivo: adicionar uma linha com a data (ou "hoje") e um resumo do que foi atualizado (ex.: "Inclusão do padrão de lazy-load; atualização da seção Imagens").
4. **Manter** a numeração das seções e a estrutura geral do documento.

Objetivo: que o contexto do projeto fique sempre atual e não se perca entre sessões.

---

Arquivo de memória para manter contexto entre sessões. O usuário pode pedir a atualização deste documento ao fechar uma parte do trabalho.

---

## 1. Estrutura do projeto

- **HTML:** `index.html` (página única).
- **CSS:** SCSS compilado para `main.css`. Um arquivo SCSS por seção/bloco.
- **JS:** `script.js` (vanilla); Swiper carregado via CDN.
- **Imagens:** `img/` (logo SVG, equipe em AVIF, etc.).

### Arquivos SCSS principais

| Arquivo | Conteúdo |
|---------|----------|
| `variables.scss` | Variáveis globais (margens, fontes). |
| `mixin.scss` | Mixins reutilizáveis (usa variables). |
| `animations.scss` | Apenas `@keyframes`. |
| `main.scss` | Ponto único: importa variables → mixin → animations → common-elements → depois todos os módulos por seção. |
| `common-elements.scss` | Componentes globais: `.sectionHeader`, `.btn-primary`, `.btn-secondary`. |
| `sectionHeaderWithSidebar.scss` | Estilos da mídia (vídeo) e botão da sidebar quando `sectionHeader--withStickySidebar`. |
| Demais | Um arquivo por seção: `header.scss`, `hero.scss`, `quemSomos.scss`, `services.scss`, `passoAPasso.scss`, `process.scss`, `values.scss`, `method.scss`, `testimonials.scss`, `you-center.scss`, `porQueSuno.scss`, `equipe.scss`, `estrutura.scss`, `faq.scss`, `contato.scss`, `pageHero.scss`, `footer.scss`, `hide.scss`. |

---

## 2. Ordem de imports no main.scss

```scss
@use "variables" as *;
@use "mixin" as *;
@use "animations" as *;
@use "common-elements" as *;
@use "sectionHeaderWithSidebar" as *;
@use "header" as *;
@use "hero" as *;
@use "quemSomos" as *;
@use "services" as *;
@use "passoAPasso" as *;
@use "process" as *;
@use "values" as *;
@use "method" as *;
@use "testimonials" as *;
@use "you-center" as *;
@use "equipe" as *;
@use "estrutura" as *;
@use "faq" as *;
@use "contato" as *;
@use "pageHero" as *;
@use "footer" as *;
@use "hide" as *;
// Depois: reset, :root, tipografia, .wrapper
```

Manter essa ordem ao adicionar novos módulos.

---

## 3. Variáveis (variables.scss)

```scss
$marginDesk: 64px;
$marginMobi: 32px;
$usedFont: Arial, Helvetica, sans-serif;
$titleFont: "Montserrat", "Arial", sans-serif;
```

- **Variáveis CSS** também em `main.scss` (`:root`): `--color-txt`, `--color-primary`, `--color-dark`, etc.
- **Hat (sectionHeader__hat) — contraste WCAG:** em `:root`: `--hat-filter-light` (fundo claro: base `#000` → vermelho próximo de `--color-primary`); `--hat-filter-dark` (fundo escuro: base `#fff` → vermelho). No common-elements: hat em fundo claro usa `color: #000; filter: var(--hat-filter-light)`; em `.sectionHeader--dark` usa `color: #fff; filter: var(--hat-filter-dark)`.

---

## 4. Mixins (mixin.scss)

| Mixin | Uso |
|-------|-----|
| `@include endOfModule` | Margem inferior do bloco: 64px desktop, 32px em ≤800px. Usado em quase todas as seções. |
| `resume($lineToResume: 3)` | Limita texto em N linhas com reticências (-webkit-line-clamp). |
| `grid($numberGrid)` | `grid-template-columns: repeat(N, 1fr)`. |
| `gridGap($numberGap)` | gap de grid. |
| `border($numberRadius)` | border-radius. |
| `list-style-none` | Remove marcador de lista e do details. |
| `center` | Flex justify/align center. |
| `debug()` | Apenas desenvolvimento (contorno vermelho em filhos). |

---

## 5. Animações (animations.scss)

- **radarPulse** — pulso no centro (scale + opacity).
- **radarWave** — onda expandindo (usado no hero).
- **cardFloatLeft** / **cardFloatRight** — cards flutuando no hero.
- **cardSlideInLeft** / **cardSlideInRight** — entrada dos cards (esquerda/direita).

Não há mixins de animação; os keyframes são usados diretamente nos módulos (ex.: hero).

---

## 6. Common-elements

- **.sectionHeader** — cabeçalho de seção: `__img`, `__hat`, `__title`, `__desc`. Modificadores: `--noImg`, `--dark`, `--withStickySidebar` (grid 2 colunas, header em 1/-1, body + sidebar; sidebar com `position: sticky; top: 120px` em ≥1221px). O hat usa filtros de contraste (ver variáveis).
- **Seções com sidebar sticky (ex.: Quem Somos):** não usar `overflow-x: hidden` no bloco em viewports grandes, senão o sticky quebra. Aplicar `overflow-x: hidden` apenas em breakpoints menores (ex.: `max-width: 1220px`) onde a sidebar não é sticky.
- **.btn-primary** / **.btn-secondary** — botões globais. O `.btn-primary` tem seta em `::after` (SVG em data-URI); se o botão tiver `<svg>` filho, usa `&:has(svg)` para esconder o `::after`.
- Media queries dentro do bloco: **1220px → 800px** (menores aninhadas nas maiores). Não usar breakpoint 760px; 800px cobre mobile.

---

## 7. Padrão de SVG no projeto

- **Não usamos SVG inline no HTML para ícones.** Apenas exceção: logo (`<img src="img/suno-consultoria.svg">`).
- **Ícones = elemento vazio no HTML** (div/span com classe) + **SVG em CSS** via:
  - `background-image: url('data:image/svg+xml,...');`
  - Em pseudo-elemento `::before` ou `::after` (geralmente `::before`).
- **Cores no data-URI:** usar `%23` no lugar de `#` (ex.: `stroke="%23dc2626"`).
- Onde isso é usado: common-elements (seta do botão), services, process, values, you-center, estrutura, faq, method, testimonials (ícones, citações, estrelas).

Ao adicionar novo ícone: criar classe no bloco (ex.: `bloco__icon bloco__icon--nome`) e definir o SVG no SCSS em `::before`/`::after`. **Exceção (footer):** ícones sociais usam sprite externo `img/footer/social-icons.svg` com `<svg><use href=".../#id"></svg>` no HTML.

---

## 8. Padrão dos sliders (Swiper)

- **Biblioteca:** Swiper 12 — CSS e JS via CDN (head: `swiper-bundle.min.css`; antes do `script.js`: `swiper-bundle.min.js`). Sempre `if (typeof Swiper !== 'undefined')` antes de instanciar; inicialização em `DOMContentLoaded`; resize com debounce 250 ms quando o slider depende da largura.
- **Um único padrão** para testimonials, equipe e estrutura.

### Estrutura HTML comum

```html
<section class="[bloco]" aria-label="...">
  <div class="wrapper">
    <div class="[bloco]__list">
      <div class="swiper mySwiper mySwiper--[modificador]">
        <div class="swiper-wrapper">
          <div class="swiper-slide">...</div>
          ...
        </div>
      </div>
      <div class="[bloco]__navigation">
        <div class="swiper-button-prev swiper-button-prev--[modificador]"></div>
        <div class="swiper-pagination swiper-pagination--[modificador]"></div>
        <div class="swiper-button-next swiper-button-next--[modificador]"></div>
      </div>
    </div>
  </div>
</section>
```

Classes obrigatórias: `swiper mySwiper mySwiper--[modificador]`, `swiper-wrapper`, `swiper-slide`; navegação com classes `--[modificador]`. Em **testimonials** a navegação fica **dentro** do `.swiper`; em equipe e estrutura é **irmã** do `.swiper`. Modificadores: `--testimonials`, `--equipe`, `--estrutura`.

### Comportamento e opções (resumo)

| Slider | Ativo | JS / opções |
|--------|--------|--------------|
| **Testimonials** | Sempre | ≤800px: 1 card por slide (JS reorganiza wrapper); desktop: 2 cards. `slidesPerView: 1`, `spaceBetween: 24`, navigation/pagination `--testimonials`. |
| **Equipe** | Só ≤800px | Acima de 800px: destroy Swiper, CSS vira grid (2 col até 1220px, 4 col 1221+). Navegação `display: none` em 801+. `slidesPerView: 1.2`, `spaceBetween: 16`, `--equipe`. |
| **Estrutura** | Sempre | `effect: 'coverflow'`, `slidesPerView: 'auto'`, `centeredSlides: true`, `coverflowEffect`: depth 120, modifier 2.2. Largura dos slides no SCSS. |

### Estilo (SCSS)

- Navegação: container flex, centralizado, gap. Botões prev/next: reset position/margin do Swiper, `::after`/`::before` em `display: none`; botão circular (40px, 36px em 800px), borda, hover com primary; `.swiper-button-disabled`: opacity 0.25.
- Pagination: `.swiper-pagination-bullet` (8px, 6px em 800px); `.swiper-pagination-bullet-active`: cor primary, width alongado (24px/20px), border-radius 4px (pill).
- Media queries: 1220 → 800 dentro dos elementos.

**Novo slider:** mesmo HTML + novo modificador (ex.: `--novo`), novo bloco no `script.js` (navigation/pagination com classes `--novo`), estender navegação/pagination no SCSS.

---

## 9. BEM e nomenclatura

- **Blocos:** camelCase (ex.: `.sectionHeader`, `.hero100`, `.you-center`).
- **Elementos:** `&__elemento` (ex.: `sectionHeader__title`, `equipe__card`).
- **Modificadores:** `&--modificador` (ex.: `sectionHeader--dark`, `equipe__consultor--more`).
- **Estados:** pseudo-classes no CSS (`:hover`, `:focus`, `:active`); não criar classes de estado no HTML.

Se no futuro houver PHP/WordPress: as mesmas classes devem ser usadas nos templates (sincronização CSS/PHP).

---

## 10. Media queries

- **Breakpoints:** apenas **1220px** e **800px** (não usar 760px; 800px cobre mobile).
- **Ordem:** maior → menor: **1220px** → **800px** (menores aninhadas nas maiores).
- **Posição:** sempre **dentro do elemento/bloco** a que se referem (aninhadas no SCSS).
- Exemplo:

```scss
.bloco {
  padding: 80px 0;
  @media screen and (max-width: 1220px) {
    padding: 64px 0;
    @media screen and (max-width: 800px) {
      padding: 48px 0;
    }
  }
}
```

Não usar mobile-first; preferir max-width do maior para o menor.

---

## 11. Acessibilidade e semântica

- Header: `role="banner"`, nav com `aria-label="Navegação principal"`.
- Main: `role="main"`. Footer: `role="contentinfo"`.
- Seções: `aria-label` descritivo.
- **Footer:** endereço em `<address>`; link do endereço para Google Maps. “Links Úteis” e “Redes Sociais” dentro de `<nav class="footer__nav" aria-label="Links úteis">` e `<nav aria-label="Redes sociais">`.
- **Passo a passo:** cada item da lista é `<article class="passoAPasso__item">` (consistência com process/values).
- **Equipe “Ver mais consultores”:** dois links `<a>` (“Ver mais” → `#equipe-consultores-expand`, “Ver menos” → `#equipe`); expansão via `:target` em CSS (sem checkbox). Span `#equipe-consultores-expand` como alvo.
- Checkboxes escondidos para interação (ex.: FAQ): `aria-hidden="true"` quando for apenas controle visual.
- Imagens: `alt` preenchido; logo com texto equivalente.
- Foco e contraste mantidos nos botões e links. **sectionHeader__hat:** contraste WCAG via filtros em `:root` (não mudar a cor; usar base #000 no claro e #fff no escuro + filtros).

---

## 12. Imagens

### Estrutura da pasta `img/`

```
img/
├── suno-consultoria.svg          # Logo do header e do footer (footer: 290px)
├── nossos-servicos.avif          # Imagem do sectionHeader (Serviços)
├── nossos-servicos.png
├── nossos-servicos.webp
├── carteiras/
│   ├── carteira-div.png         # Gráfico Carteira Dividendos (bloco Por que a Suno)
│   ├── carteira-fiis.png
│   ├── carteira-inter.png
│   ├── carteira-small-caps.png
│   └── RENOMEAR.txt             # Instruções de padronização de nomes
├── equipe/
│   ├── 01.avif … 04.avif         # Fotos dos cards da equipe
└── footer/
    ├── cvm-logo.svg              # Logo CVM no badge do footer
    └── social-icons.svg         # Sprite SVG: #instagram, #youtube, #facebook, #twitter (uso: <use href="img/footer/social-icons.svg#id">)
```

### Onde cada imagem é usada

| Uso | Caminho / classe | Observação |
|-----|------------------|------------|
| Logo header | `img/suno-consultoria.svg` | `.header__logoImg`, `width="300"`, `alt` descritivo |
| Cabeçalho Serviços | `img/nossos-servicos.avif` | `.sectionHeader__img`, `width="420"` |
| Cards equipe | `img/equipe/01.avif` … `04.avif` | `.equipe__cardImg`, alt com nome + titulação |
| Slider estrutura | URLs externas (ex.: Unsplash) | `.estrutura__slideImg` |
| Logo footer | `img/suno-consultoria.svg` | `.footer__logoImg`, `width="290"` |
| Badge CVM | `img/footer/cvm-logo.svg` | `.footer__cvmLogo` |
| Ícones redes (footer) | `img/footer/social-icons.svg` + `#id` | `<svg><use href="img/footer/social-icons.svg#instagram"/>` etc. |
| Cards Por que a Suno | `img/carteiras/carteira-div.png` etc. | `.porQueSuno__cardVisual`; **legenda:** ordem e cor dos itens (`.porQueSuno__cardLegendDot--blue`, `--orange`, `--green`, `--red`, `--purple`, `--yellow`, `--cyan`, `--gray`, `--custom`) devem coincidir com as linhas do gráfico na imagem. |

### Convenções

- **Formatos:** preferir AVIF; ter PNG/WebP como fallback quando fizer sentido (ex.: nossos-servicos).
- **Atributos:** sempre `width` e `height` (ou pelo menos um) para evitar CLS; sempre `alt` descritivo.
- **Classes:** BEM do bloco (ex.: `header__logoImg`, `sectionHeader__img`, `equipe__cardImg`, `estrutura__slideImg`).
- **Ícones decorativos:** não são `<img>`; são elementos vazios + SVG em CSS (ver seção 7).

Para imagens abaixo da dobra, considerar `loading="lazy"` (exceto LCP, ex.: hero/sectionHeader).

---

## 13. JavaScript (script.js)

- **Um único arquivo:** `script.js`, vanilla (sem jQuery).
- **Dependência:** Swiper 12 — carregado no HTML antes do `script.js`:
  - `https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js`
  - `script.js`

### Blocos no script.js

| Bloco | Função | Seletores / elementos |
|-------|--------|------------------------|
| **Animação de números (hero)** | Quando o bloco de stats entra na tela, anima os números (ex.: 0 → 3.500, 0.0 → 6.5 Bi+). | `animateNumber()`, `extractNumber()`, `shouldAnimate()`; `IntersectionObserver` (threshold 0.5); `.hero__content__statNumber`. Evita animar texto sem número (ex.: "CVM"). |
| **Testimonials slider** | Swiper sempre ativo; em ≤800px reorganiza: 1 card por slide; em desktop mantém 2 cards por slide. | `.mySwiper.mySwiper--testimonials`, `.swiper-wrapper`, `.testimonials__card`. Resize com debounce 250ms; guarda `originalHTML` para restaurar ao redimensionar. |
| **Equipe slider** | Swiper só ≤800px; acima disso destroy + CSS vira grid. | `.mySwiper.mySwiper--equipe`. `initEquipeSwiper()`; no resize, destroy e chama de novo (debounce 250ms). |
| **Estrutura slider** | Swiper coverflow, sempre ativo. | `.mySwiper.mySwiper--estrutura`; effect `coverflow`, `slidesPerView: 'auto'`. |

### Convenções JS

- Inicialização em `DOMContentLoaded`.
- Antes de usar Swiper: `if (typeof Swiper !== 'undefined')`.
- Resize: sempre `setTimeout(..., 250)` (debounce) para sliders que dependem da largura.
- Seletores por classes BEM (ex.: `.mySwiper--testimonials`, `.hero__content__statNumber`).
- Comentários de bloco: `// ========== NOME - INÍCIO / FIM ==========`.

Ao adicionar novo slider ou funcionalidade: manter o mesmo padrão (DOMContentLoaded, checagem de lib, debounce no resize quando fizer sentido).

---

## 14. Performance e CWV

- Objetivo: boa nota em LCP, CLS, FID/INP.
- Imagens: uso de AVIF/WebP onde aplicável; `width`/`height` para evitar CLS.
- Swiper carregado via CDN; inicialização só quando necessário (equipe só ≤800px).
- Evitar JS desnecessário; preferir CSS para animações e estados.

---

## 15. Blocos adicionais (páginas internas)

- **.pageHero** — Mini-hero genérico para títulos de páginas (Termos, Política, etc.). Fundo escuro (#1a1a1a), gradientes leves primary, linhas no topo e base; `__label` com contraste WCAG (`color: var(--color-txt-light)` + `filter: var(--hat-filter-dark)`); `__title` (h1). Variável `$pageHeroMinHeight: 180px`. Exemplo em `termos.html`; snippet em `pageHero-snippet.html`.
- **.contato** — Seção consultoria + form HubSpot: `__grid` (0.6fr 1fr; 1 col em 1220), `__features` (grid 2 col em 800, 3º item em linha própria), `__form` (background #ffffff10). Wrapper sem max-width próprio; `overflow-x: hidden` no bloco.

---

## 16. Histórico de atualizações (contexto)

Use esta seção para anotar o que mudou quando você pedir para “atualizar o md de contexto” ao fechar uma parte.

- **Criação** — CONTEXTO-PROJETO.md com estrutura, main/common-elements, SVGs, sliders, BEM, media queries, variables/mixin/animations, acessibilidade e CWV.
- **Atualização** — Inclusão das seções **12. Imagens** (estrutura `img/`, onde cada imagem é usada, convenções) e **13. JavaScript** (blocos do script.js, animação de números do hero, sliders, convenções JS).
- **30/01/2025** — Footer: branding sem spans (resumo); ver entrada anterior completa.
- **30/01/2025** — **Media queries:** padrão **1220px e 800px** apenas (sem 760px). Mixin `endOfModule`: mobile em ≤800px. **Seção 8 (Swiper):** conteúdo de SLIDER-SWIPER-ANALISE.md incorporado e resumido. **Seção 15:** blocos pageHero e contato. Imports: contato, pageHero, hide. Tabela SCSS atualizada. “Ver mais consultores”---

*Fim do documento. Atualize este arquivo sempre que fechar uma etapa ou quando algo relevante mudar no projeto.*
