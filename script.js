// JavaScript do projeto

// Função para animar números
function animateNumber(element, targetValue, duration = 2000) {
    const prefix = element.textContent.match(/^[^\d]*/) ?.[0] || ""; // Pega prefixo (+, R$, etc)
    const suffix = element.textContent.match(/[^\d]*$/) ?.[0] || ""; // Pega sufixo (+, Bi+, etc)

    // Começa de um valor próximo ao final para evitar CLS
    // Para bilhões (5Bi+): começa de 0 até 5
    // Para milhares (5.000): começa de 0 até 5000
    let startValue;
    if (suffix.includes("Bi") || suffix.includes("Mi")) {
        // Para bilhões/milhões: anima de 0 até o valor
        startValue = 0;
    } else {
        // Para milhares: anima de 0 até o valor
        startValue = 0;
    }

    const startTime = performance.now();
    const hasDecimal = targetValue % 1 !== 0;
    const decimals = hasDecimal ? 2 : 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = startValue + (targetValue - startValue) * easeOut;

        // Formata o número
        let formattedValue;
        if (suffix.includes("Bi")) {
            // Para bilhões, mostra com 1 casa decimal (0.0, 0.5, 1.0, ..., 6.5)
            formattedValue = currentValue.toFixed(1);
        } else if (suffix.includes("Mi")) {
            // Para milhões, mostra com 1 casa decimal
            formattedValue = currentValue.toFixed(1);
        } else {
            // Para números normais (milhares), sempre mostra formato X.XXX: 0.000 → 0.001 → ... → 3.500
            // O valor targetValue é 3500, mas formatamos como se fosse decimal para manter formato visual
            const integerPart = Math.floor(currentValue / 1000);
            const decimalPart = Math.floor(currentValue % 1000);
            formattedValue = integerPart.toString() + "." + decimalPart.toString().padStart(3, "0");
        }

        // Atualiza o texto mantendo prefixo e sufixo
        element.textContent = prefix + formattedValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Garante que termina no valor exato
            let finalValue;
            if (suffix.includes("Bi")) {
                finalValue = targetValue.toFixed(1);
            } else if (suffix.includes("Mi")) {
                finalValue = targetValue.toFixed(1);
            } else {
                // Para milhares, formata como X.XXX: 3.500
                // targetValue é 3500, formatamos como 3.500 (3 milhares + 500)
                const integerPart = Math.floor(targetValue / 1000);
                const decimalPart = targetValue % 1000;
                finalValue = integerPart.toString() + "." + decimalPart.toString().padStart(3, "0");
            }
            element.textContent = prefix + finalValue + suffix;
        }
    }

    requestAnimationFrame(update);
}

// Função para extrair o valor numérico do texto
function extractNumber(text) {
    // Remove tudo exceto números, pontos e vírgulas
    const cleaned = text.replace(/[^\d,.]/g, "");

    // Se tem ponto e vírgula, vírgula é decimal (ex: 1.234,56)
    // Se só tem ponto, pode ser separador de milhar (ex: 5.000) ou decimal
    // Se só tem vírgula, pode ser separador de milhar (ex: 5,000) ou decimal
    // Para nosso caso: "5.000" = 5000 (separador de milhar)
    //                  "5Bi" = 5 (sem separador)

    // Se tem mais de um ponto, provavelmente é separador de milhar
    if ((cleaned.match(/\./g) || []).length > 1) {
        // Remove pontos (separadores de milhar) e converte
        return parseFloat(cleaned.replace(/\./g, "")) || 0;
    }

    // Se tem ponto e vírgula, vírgula é decimal
    if (cleaned.includes(".") && cleaned.includes(",")) {
        return parseFloat(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
    }

    // Se só tem ponto, verifica se é separador de milhar (3 dígitos após) ou decimal
    if (cleaned.includes(".") && !cleaned.includes(",")) {
        const parts = cleaned.split(".");
        // Se a parte após o ponto tem 3 dígitos, é separador de milhar (5.000)
        if (parts[1] && parts[1].length === 3 && parts[0].length <= 3) {
            return parseFloat(cleaned.replace(/\./g, "")) || 0;
        }
        // Senão, ponto é decimal
        return parseFloat(cleaned.replace(".", ",").replace(",", ".")) || 0;
    }

    // Se só tem vírgula, pode ser separador de milhar ou decimal
    if (cleaned.includes(",") && !cleaned.includes(".")) {
        const parts = cleaned.split(",");
        // Se a parte após a vírgula tem 3 dígitos, é separador de milhar (5,000)
        if (parts[1] && parts[1].length === 3 && parts[0].length <= 3) {
            return parseFloat(cleaned.replace(/,/g, "")) || 0;
        }
        // Senão, vírgula é decimal
        return parseFloat(cleaned.replace(",", ".")) || 0;
    }

    // Sem separadores, converte direto
    return parseFloat(cleaned) || 0;
}

// Função para detectar se o texto deve ser animado
function shouldAnimate(text) {
    // Não anima se for apenas texto (como "CVM")
    return /\d/.test(text);
}

// Intersection Observer para animar quando o elemento aparecer na tela
const observerOptions = {
    threshold: 0.5, // Anima quando 50% do elemento estiver visível
    rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const element = entry.target;
            const originalText = element.textContent;

            // Salva o texto original para referência
            element.dataset.originalText = originalText;

            if (shouldAnimate(originalText)) {
                const prefix = originalText.match(/^[^\d]*/) ?.[0] || "";
                const suffix = originalText.match(/[^\d]*$/) ?.[0] || "";

                // Extrai o valor final do HTML
                const targetValue = extractNumber(originalText);

                // Zera imediatamente para evitar CLS (mantém o formato exato)
                if (suffix.includes("Bi")) {
                    element.textContent = prefix + "0.0" + suffix;
                } else {
                    // Para milhares, SEMPRE usa "0.000" para manter o mesmo tamanho visual
                    element.textContent = prefix + "0.000" + suffix;
                }

                // Pequeno delay para garantir que o zero foi aplicado
                requestAnimationFrame(() => {
                    element.dataset.animated = "true";
                    animateNumber(element, targetValue);
                });
            } else {
                // Marca como animado mesmo que não precise animar
                element.dataset.animated = "true";
            }

            // Para de observar após animar
            observer.unobserve(element);
        }
    });
}, observerOptions);


// Inicializa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    const statNumbers = document.querySelectorAll(".hero__content__statNumber");

    statNumbers.forEach((element) => {
        observer.observe(element);
    });

});

// ============================================
// TESTIMONIALS SLIDER - INÍCIO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const swiperContainer = document.querySelector(".mySwiper.mySwiper--testimonials");
        const swiperWrapper = swiperContainer ?.querySelector(".swiper-wrapper");
        let swiperInstance = null;
        let originalHTML = null;

        function reorganizeSlides() {
            if (!swiperWrapper) return;

            const isMobile = window.innerWidth <= 800;

            // Salva o HTML original na primeira vez
            if (!originalHTML) {
                originalHTML = swiperWrapper.innerHTML;
            }

            // Restaura o HTML original
            swiperWrapper.innerHTML = originalHTML;

            if (isMobile) {
                // Mobile: cada card vira um slide separado
                const allCards = Array.from(swiperWrapper.querySelectorAll('.testimonials__card'));
                const newSlides = [];

                allCards.forEach(card => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.appendChild(card);
                    newSlides.push(slide);
                });

                // Limpa e adiciona novos slides
                swiperWrapper.innerHTML = '';
                newSlides.forEach(slide => swiperWrapper.appendChild(slide));
            }
            // Se não for mobile, mantém o HTML original (2 cards por slide)

            // Reinicializa o Swiper
            if (swiperInstance) {
                swiperInstance.destroy(true, true);
            }

            swiperInstance = new Swiper(".mySwiper.mySwiper--testimonials", {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 24,
                speed: 600,
                navigation: {
                    nextEl: ".swiper-button-next--testimonials",
                    prevEl: ".swiper-button-prev--testimonials",
                },
                pagination: {
                    el: ".swiper-pagination.swiper-pagination--testimonials",
                    clickable: true,
                    dynamicBullets: false,
                    type: 'bullets',
                },
            });
        }

        // Reorganiza na inicialização
        reorganizeSlides();

        // Reorganiza quando a janela é redimensionada
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(reorganizeSlides, 250);
        });
    }
});
// ============================================
// TESTIMONIALS SLIDER - FIM
// ============================================

// ============================================
// EQUIPE SLIDER - INÍCIO (só ativa do 800px pra baixo)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const equipeContainer = document.querySelector(".mySwiper.mySwiper--equipe");
        let equipeSwiperInstance = null;

        function initEquipeSwiper() {
            if (!equipeContainer) return;
            const isSlider = window.innerWidth <= 800;

            if (isSlider && !equipeSwiperInstance) {
                equipeSwiperInstance = new Swiper(".mySwiper.mySwiper--equipe", {
                    slidesPerView: 1.2,
                    slidesPerGroup: 1,
                    spaceBetween: 16,
                    speed: 600,
                    navigation: {
                        nextEl: ".swiper-button-next--equipe",
                        prevEl: ".swiper-button-prev--equipe",
                    },
                    pagination: {
                        el: ".swiper-pagination.swiper-pagination--equipe",
                        clickable: true,
                        dynamicBullets: false,
                        type: 'bullets',
                    },
                });
            } else if (!isSlider && equipeSwiperInstance) {
                equipeSwiperInstance.destroy(true, true);
                equipeSwiperInstance = null;
            }
        }

        initEquipeSwiper();

        let equipeResizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(equipeResizeTimeout);
            equipeResizeTimeout = setTimeout(function() {
                if (equipeSwiperInstance) {
                    equipeSwiperInstance.destroy(true, true);
                    equipeSwiperInstance = null;
                }
                initEquipeSwiper();
            }, 250);
        });
    }
});
// ============================================
// EQUIPE SLIDER - FIM
// ============================================

// ============================================
// POR QUE A SUNO SLIDER (2 cards por vez, 4 total) - INÍCIO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const porQueSunoEl = document.querySelector(".mySwiper.mySwiper--porQueSuno");
        if (porQueSunoEl) {
            new Swiper(".mySwiper.mySwiper--porQueSuno", {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 24,
                speed: 600,
                breakpoints: {
                    760: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                    },
                },
                navigation: {
                    nextEl: ".swiper-button-next--porQueSuno",
                    prevEl: ".swiper-button-prev--porQueSuno",
                },
                pagination: {
                    el: ".swiper-pagination.swiper-pagination--porQueSuno",
                    clickable: true,
                    dynamicBullets: false,
                    type: 'bullets',
                },
            });
        }
    }
});
// ============================================
// POR QUE A SUNO SLIDER - FIM
// ============================================

// ============================================
// ESTRUTURA SLIDER (coverflow) - INÍCIO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const estruturaContainer = document.querySelector(".mySwiper.mySwiper--estrutura");
        if (estruturaContainer) {
            new Swiper(".mySwiper.mySwiper--estrutura", {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                initialSlide: 2,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 120,
                    modifier: 2.2,
                    slideShadows: false,
                },
                spaceBetween: 24,
                speed: 600,
                navigation: {
                    nextEl: ".swiper-button-next--estrutura",
                    prevEl: ".swiper-button-prev--estrutura",
                },
                pagination: {
                    el: ".swiper-pagination.swiper-pagination--estrutura",
                    clickable: true,
                    dynamicBullets: false,
                    type: 'bullets',
                },
            });
        }
    }
});
// ============================================
// ESTRUTURA SLIDER - FIM
// ============================================