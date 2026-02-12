# Análise dos sliders (Swiper) no projeto

> **Conteúdo incorporado ao `CONTEXTO-PROJETO.md` (seção 8).** Este arquivo pode ser mantido como referência detalhada ou removido.

Uso do **Swiper 12** em três blocos: **Testimonials**, **Equipe** e **Estrutura**. Este documento descreve a estrutura HTML, a navegação, os estilos e a instanciação em JS para reutilizar o padrão.

---

## 1. O que está importado no sistema

### HTML (`index.html`)

- **CSS (head):**  
  `https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css`
- **JS (antes do `script.js`):**  
  `https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js`  
  `script.js`

Ordem obrigatória: Swiper → depois `script.js`.

### Uso no JS

- Sempre verificar: `if (typeof Swiper !== 'undefined')` antes de instanciar.
- Inicialização dentro de `DOMContentLoaded`.
- Resize: debounce de **250 ms** quando o slider depende da largura (testimonials, equipe).

---

## 2. Estrutura HTML comum

Padrão usado nos três blocos:

```html
<section class="[bloco]" aria-label="...">
    <div class="wrapper">
        <!-- sectionHeader quando existir -->
        <div class="[bloco]__list">
            <div class="swiper mySwiper mySwiper--[modificador]">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <!-- Conteúdo do slide (card, artigo, etc.) -->
                    </div>
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

### Diferença por bloco

| Bloco         | Modificador     | Navegação em relação ao `.swiper` |
|---------------|-----------------|-----------------------------------|
| **Equipe**    | `--equipe`      | Fora do swiper: `.equipe__list` contém swiper + `.equipe__navigation` |
| **Estrutura** | `--estrutura`   | Fora do swiper: `.estrutura__list` contém swiper + `.estrutura__navigation` |
| **Testimonials** | `--testimonials` | **Dentro** do swiper: `.testimonials__navigation` está **dentro** de `.swiper.mySwiper--testimonials` |

Ou seja: em **equipe** e **estrutura** a navegação é irmã do `.swiper`; em **testimonials** é filha do `.swiper`. Os seletores do JS (navigation/pagination) são pelos modificadores, então funcionam em ambos os casos.

### Classes obrigatórias

- Container: `swiper mySwiper mySwiper--[modificador]` (ex.: `mySwiper--equipe`).
- Wrapper: `swiper-wrapper`.
- Slide: `swiper-slide`.
- Navegação:  
  `swiper-button-prev swiper-button-prev--[modificador]`  
  `swiper-pagination swiper-pagination--[modificador]`  
  `swiper-button-next swiper-button-next--[modificador]`

---

## 3. Navegação: como funciona e como é estilizada

### Papel dos elementos

- **Prev/Next:** Swiper associa por `nextEl` / `prevEl` aos elementos com as classes acima; não precisa de ícone no HTML (o padrão do Swiper é desligado no CSS).
- **Pagination:** Swiper preenche o `el` com bullets e usa a classe `.swiper-pagination-bullet` e `.swiper-pagination-bullet-active`.

### Estilo (padrão nos três módulos)

- **Container da navegação**  
  - `.equipe__navigation` / `.estrutura__navigation` / `.testimonials__navigation`:  
    `display: flex`, `align-items: center`, `justify-content: center`, `gap: 12px` (8px em 760px).  
  - Equipe: navegação **escondida** em `min-width: 801px` (`display: none`); só aparece quando o slider está ativo (≤800px).

- **Botões prev/next (todos os modificadores)**  
  - Reset do padrão Swiper: `position: relative !important`, `margin/top/left/right: 0 ou auto !important`.  
  - `::after` e `::before` do Swiper: `display: none !important` (setas padrão desligadas).  
  - Botão: círculo 40px (36px em 760px; testimonials 32px em 760px), `border-radius: 50%`, borda, `background-color: var(--background-color)`, transição.  
  - Hover: cor primária/clara, `transform: translateY(-2px)`, sombra.  
  - `.swiper-button-disabled`: `opacity: 0.25`, `cursor: not-allowed`, `pointer-events: none`.  
  - Se houver `svg` dentro do botão: `fill` e `stroke: var(--color-primary)`; tamanho ~14px (12px ou 11px em breakpoints menores).  
  - Cores da borda/background variam por bloco (equipe/estrutura usam primary; testimonials fundo escuro com borda suave).

- **Pagination (bullets)**  
  - Container: `position: relative !important`, `margin: 0`, `width: auto`, `bottom/left: auto`.  
  - `.swiper-pagination-bullet`:  
    - 8px (6px em 760px), `border-radius: 50%`, cor de fundo suave (primary ou txt-light com opacidade), `margin: 0 4px` (3px em 760px).  
  - `.swiper-pagination-bullet-active`:  
    - Cor sólida `var(--color-primary)` (ou equivalente no tema do bloco), **width alongado** (24px, 20px em 760px), `border-radius: 4px` (bullet “pill”).

Ou seja: **navegação centralizada**, **botões circulares sem seta padrão**, **bullets com bullet ativo alongado**.

---

## 4. Instanciação no JS (`script.js`)

### Testimonials

- **Comportamento:** Sempre slider. Em **≤800px** o JS reorganiza o conteúdo: cada `.testimonials__card` vira um `.swiper-slide` (1 card por slide). Em desktop mantém 2 cards por slide (HTML original).
- **Fluxo:**  
  - Guarda `originalHTML` do `.swiper-wrapper`.  
  - Em cada `reorganizeSlides()`: restaura `originalHTML`, se mobile quebra em slides de 1 card, senão mantém; destrói a instância anterior (se existir) e cria nova `Swiper`.  
  - Chama `reorganizeSlides()` no load e no `resize` (debounce 250 ms).
- **Opções usadas:**  
  `slidesPerView: 1`, `slidesPerGroup: 1`, `spaceBetween: 24`, `speed: 600`,  
  `navigation`: `nextEl` / `prevEl` com classes `--testimonials`,  
  `pagination`: `el` com `.swiper-pagination--testimonials`, `clickable: true`, `type: 'bullets'`.

### Equipe

- **Comportamento:** Slider **só em ≤800px**. Acima de 800px o JS **destrói** o Swiper e o CSS vira `.swiper-wrapper` em **grid** (2 colunas até 1220px, 4 colunas em 1221+). Navegação fica `display: none` em 801+.
- **Fluxo:**  
  - `initEquipeSwiper()`: se `window.innerWidth <= 800` e ainda não existe instância, cria `Swiper`; se `> 800` e existe instância, `destroy(true, true)` e zera.  
  - No `resize` (debounce 250 ms): destrói e chama de novo `initEquipeSwiper()`.
- **Opções usadas:**  
  `slidesPerView: 1.2`, `slidesPerGroup: 1`, `spaceBetween: 16`, `speed: 600`,  
  `navigation` e `pagination` com classes `--equipe`.

### Estrutura

- **Comportamento:** Slider **sempre ativo**, efeito **coverflow**.
- **Opções usadas:**  
  `effect: 'coverflow'`, `grabCursor: true`, `centeredSlides: true`, `slidesPerView: 'auto'`, `initialSlide: 2`,  
  `coverflowEffect`: `rotate: 0`, `stretch: 0`, `depth: 120`, `modifier: 2.2`, `slideShadows: false`,  
  `spaceBetween: 24`, `speed: 600`,  
  `navigation` e `pagination` com classes `--estrutura`.

A largura dos slides em estrutura é controlada pelo SCSS (`.estrutura__list .swiper-slide`: width em %, max-width).

---

## 5. Resumo para reutilizar

1. **HTML:**  
   - `.swiper.mySwiper.mySwiper--[novo]` + `.swiper-wrapper` + `.swiper-slide`(s).  
   - Navegação: wrapper (ex.: `[bloco]__navigation`) com `.swiper-button-prev.swiper-button-prev--[novo]`, `.swiper-pagination.swiper-pagination--[novo]`, `.swiper-button-next.swiper-button-next--[novo]`. Pode ser irmão do `.swiper` (como equipe/estrutura) ou filho (como testimonials).

2. **JS:**  
   - Em `DOMContentLoaded`, com `if (typeof Swiper !== 'undefined')`.  
   - `new Swiper(".mySwiper.mySwiper--[novo]", { navigation: { nextEl: ".swiper-button-next--[novo]", prevEl: ".swiper-button-prev--[novo]" }, pagination: { el: ".swiper-pagination.swiper-pagination--[novo]", clickable: true, type: 'bullets' }, ... })`.  
   - Se o comportamento depender da largura: `resize` com debounce 250 ms, destroy + init quando necessário.

3. **SCSS:**  
   - Dentro do bloco (ex.: `.equipe__list`): estilos do `.swiper`, `.swiper-wrapper`, `.swiper-slide`.  
   - Navegação: `.swiper-button-prev--[novo]` e `.swiper-button-next--[novo]`: reset position/margin, `::after`/`::before` em `none`, botão circular, hover, `.swiper-button-disabled`.  
   - `.swiper-pagination--[novo]`: reset position; `.swiper-pagination-bullet` (tamanho, cor, margin); `.swiper-pagination-bullet-active` (cor, width alongado, border-radius 4px).  
   - Media queries 1220 → 800 → 760 dentro dos elementos, conforme padrão do projeto.

Assim você passa a usar de forma consistente o que já está importado (Swiper 12) e o padrão de navegação e estrutura já adotado nos módulos de slider.
