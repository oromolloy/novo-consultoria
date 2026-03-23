# Padronização do Projeto — Reutilizável

Documento único de convenções: estrutura, nomenclatura, comportamento, Slider (Swiper), SVG, media queries, acessibilidade e performance. Use como referência ao iniciar ou manter outro projeto.

---

## 1. Estrutura de arquivos

### HTML / CSS / JS

- **HTML:** página única ou templates por rota; semântico (section, article, nav, address).
- **CSS:** SCSS compilado para um `main.css`. **Um arquivo SCSS por seção/bloco.**
- **Nome dos arquivos `.scss`:** **kebab-case em inglês**, alinhado ao **bloco BEM em camelCase (inglês)** no HTML/CSS (ex.: `who-we-are.scss` → `.whoWeAre`, `video-testimonials.scss` → `.videoTestimonials`). **Não** usar camelCase no nome do ficheiro (~~`quemSomos.scss`~~). Um ficheiro = um bloco principal; estilos extra do mesmo bloco ficam no mesmo `.scss` (ex.: passos da timeline em `you-center.scss` com `.you-center__steps*`).
- **JS:** um arquivo principal (ex.: `script.js`), vanilla; dependências (ex.: Swiper) via CDN quando possível.

### Ordem de imports no `main.scss`

```scss
@use "variables" as *;
@use "mixin" as *;
@use "animations" as *;
@use "common-elements" as *;
// ... section-header-with-sidebar (se existir)
// ... um @use por bloco/seção (header, hero, services, etc.)
// Por último no main: reset, :root, tipografia, .wrapper
```

- Variáveis e mixins sempre primeiro; animações em arquivo separado (só `@keyframes`); common-elements em seguida; depois os módulos por seção.

### Layout global

- **`.wrapper`:** container central, `max-width` (ex.: 1420px / 1180px em breakpoints), `margin: 0 auto`, `padding` lateral em telas menores (ex.: 16px em ≤1220px).

---

## 2. Variáveis (variables.scss)

```scss
$marginDesk: 64px;
$marginMobi: 32px;
$usedFont: Arial, Helvetica, sans-serif;
$titleFont: "Montserrat", "Arial", sans-serif;
```

- **Variáveis CSS** em `main.scss` (`:root`): cores, fundos, filtros (ex.: `--color-txt`, `--color-primary`, `--color-dark`, `--hat-filter-light`, `--hat-filter-dark`).
- Usar `$marginDesk` / `$marginMobi` em margens de fim de módulo e gaps quando fizer sentido.

---

## 3. Mixins (mixin.scss)

| Mixin | Uso |
|-------|-----|
| `@include endOfModule` | Margem inferior do bloco: desktop `$marginDesk`, ≤800px `$marginMobi`. |
| `resume($lineToResume: 3)` | Limita texto em N linhas com reticências (-webkit-line-clamp). |
| `grid($numberGrid)` | `grid-template-columns: repeat(N, 1fr)`. |
| `gridGap($numberGap)` | gap de grid. |
| `border($numberRadius)` | border-radius. |
| `list-style-none` | Remove marcador de lista e do details (incl. ::marker). |
| `center` | Flex justify/align center. |
| `debug()` | Apenas desenvolvimento (contorno em filhos). |

- `mixin.scss` deve usar `@use "variables" as *;` quando precisar de variáveis.

---

## 4. Animações (animations.scss)

- Arquivo contém **apenas** `@keyframes` (sem mixins de animação).
- Os keyframes são usados nos módulos (ex.: hero, cards) com `animation-name` e `animation-duration` etc.
- Exemplos de nomes: `radarPulse`, `radarWave`, `cardFloatLeft`, `cardSlideInLeft` — manter nomes descritivos e em camelCase.

---

## 5. BEM e nomenclatura

### Regras

- **Blocos:** camelCase (ex.: `.sectionHeader`, `.you-center`, `.team`).
- **Elementos:** `&__elemento` (ex.: `sectionHeader__title`, `equipe__card`).
- **Modificadores:** `&--modificador` (ex.: `sectionHeader--dark`, `equipe__consultor--more`).
- **Estados:** apenas pseudo-classes no CSS (`:hover`, `:focus`, `:active`); **não** criar classes de estado no HTML.

### Sincronização HTML/CSS (e PHP)

- Se o nome da classe mudar no SCSS, atualizar no HTML (e nos templates PHP) no mesmo momento.
- Manter as mesmas convenções nos dois lados.

---

## 6. Media queries

### Breakpoints

- **Usados:** **1220px**, **800px** e **760px** apenas como **nível aninhado** dentro de **800px** (nunca repetir `800px` dentro de `800px` — o aninhamento errado era cópia/colagem; o interior correto é **760px**).
- **Não** confundir com dois `@media 800` em **seletores irmãos** (ex.: `&__x { @media 800 {…} }` e depois `&__y { @media 800 {…} }`) — isso é válido.
- **Ordem:** maior → menor: **1220px** → **800px** → **760px** (só aninhado dentro de 800px, quando precisar de um passo extra).
- **Posição:** sempre **dentro do elemento/bloco** a que se referem (aninhadas no SCSS).
- **Abordagem:** max-width do maior para o menor (não mobile-first).

### Exemplo

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

## 7. Padrão de SVG (ícones)

### Regra geral

- **Não** usar SVG inline no HTML para ícones. Exceção: logo (ex.: `<img src="img/logo.svg">`).
- **Ícones = elemento vazio no HTML** (div/span com classe) + **SVG no CSS**:
  - `background-image: url('data:image/svg+xml,...');`
  - Em `::before` ou `::after` (geralmente `::before`).

### Cores no data-URI

- Usar **`%23`** no lugar de **`#`** (ex.: `stroke="%23dc2626"`).

### Novo ícone

- Criar classe no bloco (ex.: `bloco__icon bloco__icon--nome`).
- Definir o SVG no SCSS em `::before` ou `::after` (content, position, size, background-image, background-repeat, background-position, background-size).

### Exceção

- Ícones sociais (ex.: footer): pode usar sprite externo `img/social-icons.svg` com `<svg><use href=".../#id"></use></svg>` no HTML.

---

## 8. Componentes comuns (common-elements)

### Section header

- Bloco reutilizável: `__img`, `__hat`, `__title`, `__desc`.
- Modificadores: `--noImg`, `--dark`, `--withStickySidebar` (quando houver grid 2 colunas + sidebar sticky).
- Hat com contraste WCAG: em `:root` usar filtros (ex.: `--hat-filter-light`, `--hat-filter-dark`); no bloco, cor base (#000 ou #fff) + `filter: var(--hat-filter-*)`.

### Coluna sticky

- **Regra:** em seções com coluna sticky, **não** usar `overflow-x: hidden` no bloco em viewports grandes, senão o sticky quebra.
- Aplicar `overflow-x: hidden` apenas em `max-width: 1220px` (quando o layout vira 1 coluna).
- Exemplo de uso: coluna com `position: sticky; top: 128px` em `min-width: 1221px` e `position: static` em `max-width: 1220px`.

### Botões

- `.btn-primary` / `.btn-secondary`: estilos globais.
- Seta do primário em `::after` (SVG em data-URI). Se o botão tiver `<svg>` filho, usar `&:has(svg) { &::after { display: none; } }`.

---

## 9. Sliders (Swiper) — Estrutura, comportamento e nomenclatura

> Baseado no **SLIDER-SWIPER-ANALISE.md**. Biblioteca: **Swiper 12**.

### 9.1 Carregamento

**HTML**

- **CSS (head):**  
  `https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css`
- **JS (antes do `script.js`):**  
  `https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js`  
  `script.js`

Ordem obrigatória: Swiper → depois o `script.js` do projeto.

**JavaScript**

- Sempre: `if (typeof Swiper !== 'undefined')` antes de instanciar.
- Inicialização dentro de `DOMContentLoaded`.
- Resize: **debounce 250 ms** quando o slider depende da largura (ex.: testimonials, equipe).

---

### 9.2 Estrutura HTML comum

```html
<section class="[bloco]" aria-label="...">
  <div class="wrapper">
    <div class="[bloco]__list">
      <div class="swiper mySwiper mySwiper--[modificador]">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><!-- Conteúdo --></div>
          <!-- mais .swiper-slide -->
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

**Variação:** a navegação pode ficar **dentro** do `.swiper` (ex.: testimonials) ou como **irmã** do `.swiper` (ex.: equipe, estrutura). Os seletores do JS usam o modificador, então ambos funcionam.

**Classes obrigatórias**

- Container: `swiper mySwiper mySwiper--[modificador]`
- Wrapper: `swiper-wrapper`
- Slide: `swiper-slide`
- Navegação:  
  `swiper-button-prev swiper-button-prev--[modificador]`  
  `swiper-pagination swiper-pagination--[modificador]`  
  `swiper-button-next swiper-button-next--[modificador]`

---

### 9.3 Navegação: papel e estilo

**Papel**

- Prev/Next: Swiper associa por `nextEl` / `prevEl`; não é necessário ícone no HTML (o padrão do Swiper é desligado no CSS).
- Pagination: Swiper preenche o `el` com bullets (`.swiper-pagination-bullet`, `.swiper-pagination-bullet-active`).

**Estilo (padrão reutilizável)**

- **Container da navegação:**  
  `display: flex`, `align-items: center`, `justify-content: center`, `gap: 12px` (8px em 800px).  
  Se o slider for só em mobile: navegação `display: none` em `min-width: 801px`.

- **Botões prev/next:**  
  - Reset: `position: relative`, `margin/top/left/right: 0` ou `auto`; `::after` e `::before` do Swiper: `display: none`.  
  - Botão: círculo 40px (36px em 800px), `border-radius: 50%`, borda, fundo, transição.  
  - Hover: cor primária, `transform: translateY(-2px)`, sombra.  
  - `.swiper-button-disabled`: `opacity: 0.25`, `cursor: not-allowed`, `pointer-events: none`.

- **Pagination (bullets):**  
  - Container: `position: relative`, `margin: 0`, `width: auto`.  
  - `.swiper-pagination-bullet`: 8px (6px em 800px), `border-radius: 50%`, cor de fundo suave, `margin: 0 4px`.  
  - `.swiper-pagination-bullet-active`: cor sólida primary, **width alongado** (24px, 20px em 800px), `border-radius: 4px` (pill).

---

### 9.4 Comportamentos de referência

| Tipo | Quando ativo | Observação |
|------|--------------|-------------|
| **Sempre slider** | Todos os viewports | Ex.: testimonials (com reorganização em mobile), estrutura (coverflow). |
| **Slider só ≤800px** | Acima: destroy Swiper, CSS vira grid | Resize com debounce 250 ms; destroy + init quando cruzar 800px. |
| **Coverflow** | Sempre | `effect: 'coverflow'`, `slidesPerView: 'auto'`, `centeredSlides: true`; largura dos slides no SCSS. |

**Opções típicas**

- Testimonials: `slidesPerView: 1`, `spaceBetween: 24`, navigation/pagination com `--testimonials`.
- Team (só ≤800px): `slidesPerView: 1.2`, `spaceBetween: 16`, `--team`.
- Estrutura: `effect: 'coverflow'`, `coverflowEffect: { depth: 120, modifier: 2.2 }`, `--estrutura`.

---

### 9.5 Novo slider (checklist)

1. **HTML:**  
   `.swiper.mySwiper.mySwiper--[novo]` + `.swiper-wrapper` + `.swiper-slide`(s).  
   Navegação com `.swiper-button-prev--[novo]`, `.swiper-pagination--[novo]`, `.swiper-button-next--[novo]`.

2. **JS:**  
   Em `DOMContentLoaded`, com `if (typeof Swiper !== 'undefined')`.  
   `new Swiper(".mySwiper.mySwiper--[novo]", { navigation: { nextEl: ".swiper-button-next--[novo]", prevEl: ".swiper-button-prev--[novo]" }, pagination: { el: ".swiper-pagination--[novo]", clickable: true, type: 'bullets' }, ... })`.  
   Se depender da largura: listener de `resize` com debounce 250 ms; destroy e init quando necessário.

3. **SCSS:**  
   Estilos do `.swiper`, `.swiper-wrapper`, `.swiper-slide` dentro do bloco (ex.: `[bloco]__list`).  
   Navegação: reset dos botões, `::after`/`::before` em `none`, botão circular, hover, `.swiper-button-disabled`; bullets e bullet-active conforme padrão acima.  
   Media queries 1220 → 800 **dentro** dos elementos.

---

## 10. Imagens

### Estrutura sugerida

- Pasta `img/` na raiz (ou em `assets/`): logo, hero, seções, equipe, footer, sprites.
- Subpastas por contexto (ex.: `img/equipe/`, `img/footer/`).

### Convenções

- **Formatos:** preferir AVIF; PNG/WebP como fallback quando fizer sentido.
- **Atributos:** sempre `width` e `height` (ou ao menos um) para evitar CLS; sempre `alt` descritivo.
- **Classes:** BEM do bloco (ex.: `header__logoImg`, `sectionHeader__img`, `equipe__cardImg`).
- **Ícones decorativos:** não são `<img>`; são elemento vazio + SVG em CSS (ver seção 7).
- **Lazy-load:** `loading="lazy"` em imagens abaixo da dobra; evitar em LCP (hero, sectionHeader).

---

## 11. Acessibilidade e semântica

- **Header:** `role="banner"`; nav com `aria-label="Navegação principal"`.
- **Main:** `role="main"`. **Footer:** `role="contentinfo"`.
- **Seções:** `aria-label` descritivo.
- **Footer:** endereço em `<address>`; links úteis e redes em `<nav>` com `aria-label` apropriado.
- **Listas de conteúdo:** usar `<article>` por item quando fizer sentido (ex.: passo a passo, cards de processo).
- **Controles visuais (ex.: FAQ):** checkboxes só visuais com `aria-hidden="true"` quando não forem o foco da acessibilidade.
- **Imagens:** `alt` preenchido; logo com texto equivalente.
- **Foco e contraste:** manter foco visível e contraste adequado (AA/AAA) em botões e links.

---

## 12. JavaScript (convenções)

- Um único arquivo principal (ex.: `script.js`), vanilla.
- Inicialização em `DOMContentLoaded`.
- Antes de usar lib externa (ex.: Swiper): `if (typeof Swiper !== 'undefined')`.
- Resize: debounce (ex.: 250 ms) para lógica que depende da largura.
- Seletores por classes BEM; evitar IDs para estilo/comportamento.
- Comentários de bloco: ex. `// ========== NOME - INÍCIO / FIM ==========`.

---

## 13. Performance e Core Web Vitals

- Objetivo: boas notas em LCP, CLS, FID/INP.
- Imagens: AVIF/WebP quando possível; `width`/`height` para evitar CLS.
- Sliders: carregar lib via CDN; inicializar só quando necessário (ex.: slider só em mobile).
- Preferir CSS para animações e estados; evitar JS desnecessário.

---

## 14. Resumo rápido (checklist)

- [ ] Arquivos **`.scss`** em **kebab-case inglês** alinhados ao bloco **camelCase inglês**; elementos `__elemento`; modificadores `--modificador`.
- [ ] **Media queries** 1220 → 800 → (760 só aninhado em 800); nunca dois `800` seguidos no mesmo ramo; dentro do elemento.
- [ ] **SVG:** ícones em CSS (data-URI em `::before`/`::after`); `%23` no lugar de `#`.
- [ ] **Sticky:** sem `overflow-x: hidden` no bloco em desktop; overflow só em ≤1220px quando layout for 1 coluna.
- [ ] **Swiper:** HTML com `mySwiper--[modificador]`, navegação com mesmo modificador; JS com checagem de lib e debounce no resize; SCSS com botões circulares e bullet ativo alongado.
- [ ] **Imagens:** `width`/`height`, `alt`; lazy quando abaixo da dobra.
- [ ] **HTML** semântico e **acessível** (roles, aria-labels, contraste).
- [ ] **CSS/PHP** (ou HTML) sincronizados nas classes.

---

*Documento gerado a partir do CONTEXTO-PROJETO.md e do SLIDER-SWIPER-ANALISE.md para reutilização em outros projetos.*
