// JavaScript do projeto

// Função para animar números
function animateNumber(element, targetValue, duration = 2000) {
    const prefix = element.textContent.match(/^[^\d]*/)?.[0] || "";
    const suffix = element.textContent.match(/[^\d]*$/)?.[0] || "";

    let startValue;
    if (suffix.includes("Bi") || suffix.includes("Mi")) {
        startValue = 0;
    } else {
        startValue = 0;
    }

    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = startValue + (targetValue - startValue) * easeOut;

        let formattedValue;
        if (suffix.includes("Bi")) {
            formattedValue = currentValue.toFixed(1);
        } else if (suffix.includes("Mi")) {
            formattedValue = currentValue.toFixed(1);
        } else {
            const integerPart = Math.floor(currentValue / 1000);
            const decimalPart = Math.floor(currentValue % 1000);
            formattedValue = integerPart.toString() + "." + decimalPart.toString().padStart(3, "0");
        }

        element.textContent = prefix + formattedValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            let finalValue;
            if (suffix.includes("Bi")) {
                finalValue = targetValue.toFixed(1);
            } else if (suffix.includes("Mi")) {
                finalValue = targetValue.toFixed(1);
            } else {
                const integerPart = Math.floor(targetValue / 1000);
                const decimalPart = targetValue % 1000;
                finalValue = integerPart.toString() + "." + decimalPart.toString().padStart(3, "0");
            }
            element.textContent = prefix + finalValue + suffix;
        }
    }

    requestAnimationFrame(update);
}

function extractNumber(text) {
    const cleaned = text.replace(/[^\d,.]/g, "");

    if ((cleaned.match(/\./g) || []).length > 1) {
        return parseFloat(cleaned.replace(/\./g, "")) || 0;
    }

    if (cleaned.includes(".") && cleaned.includes(",")) {
        return parseFloat(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
    }

    if (cleaned.includes(".") && !cleaned.includes(",")) {
        const parts = cleaned.split(".");
        if (parts[1] && parts[1].length === 3 && parts[0].length <= 3) {
            return parseFloat(cleaned.replace(/\./g, "")) || 0;
        }
        return parseFloat(cleaned.replace(".", ",").replace(",", ".")) || 0;
    }

    if (cleaned.includes(",") && !cleaned.includes(".")) {
        const parts = cleaned.split(",");
        if (parts[1] && parts[1].length === 3 && parts[0].length <= 3) {
            return parseFloat(cleaned.replace(/,/g, "")) || 0;
        }
        return parseFloat(cleaned.replace(",", ".")) || 0;
    }

    return parseFloat(cleaned) || 0;
}

function shouldAnimate(text) {
    return /\d/.test(text);
}

const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const element = entry.target;
            const originalText = element.textContent;

            element.dataset.originalText = originalText;

            if (shouldAnimate(originalText)) {
                const prefix = originalText.match(/^[^\d]*/)?.[0] || "";
                const suffix = originalText.match(/[^\d]*$/)?.[0] || "";

                const targetValue = extractNumber(originalText);

                if (suffix.includes("Bi")) {
                    element.textContent = prefix + "0.0" + suffix;
                } else {
                    element.textContent = prefix + "0.000" + suffix;
                }

                requestAnimationFrame(() => {
                    element.dataset.animated = "true";
                    animateNumber(element, targetValue);
                });
            } else {
                element.dataset.animated = "true";
            }

            observer.unobserve(element);
        }
    });
}, observerOptions);

function debounceResize(fn, ms) {
    let t;
    return function () {
        clearTimeout(t);
        t = setTimeout(fn, ms);
    };
}

// Scroll suave em âncoras da mesma página
(function () {
    function smoothScrollTo(targetY, duration) {
        var scrollEl = document.scrollingElement || document.documentElement;
        var startY = scrollEl.scrollTop;
        var distance = targetY - startY;
        if (distance === 0) return;
        var startTime = null;

        function ease(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function tick(now) {
            if (!startTime) startTime = now;
            var p = Math.min((now - startTime) / duration, 1);
            scrollEl.scrollTop = startY + distance * ease(p);
            if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    document.addEventListener("click", function (e) {
        var link = e.target.closest && e.target.closest('a[href^="#"]');
        if (!link) return;

        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        var target;
        try { target = document.querySelector(hash); } catch (_) { return; }
        if (!target) return;

        e.preventDefault();

        var scrollEl = document.scrollingElement || document.documentElement;
        var headerEl = document.querySelector(".header");
        var offset = headerEl ? headerEl.getBoundingClientRect().height : 0;
        var targetY = target.getBoundingClientRect().top + scrollEl.scrollTop - offset;

        smoothScrollTo(targetY, 700);

        if (history.pushState) history.pushState(null, "", hash);
    });
})();

document.addEventListener("DOMContentLoaded", function () {
    (function initHeaderMenuA11y() {
        const toggle = document.getElementById("header__menuToggle");
        const label = document.querySelector(".header__menuButton");
        if (!toggle || !label) return;
        function syncMenuExpanded() {
            label.setAttribute("aria-expanded", toggle.checked ? "true" : "false");
        }
        label.setAttribute("aria-controls", "header-main-menu");
        label.setAttribute("aria-expanded", "false");
        label.setAttribute("tabindex", "0");
        toggle.setAttribute("tabindex", "-1");
        toggle.addEventListener("change", syncMenuExpanded);
        label.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle.checked = !toggle.checked;
                toggle.dispatchEvent(new Event("change"));
            }
        });
        syncMenuExpanded();
    })();

    const statNumbers = document.querySelectorAll(".hero__content__statNumber");
    statNumbers.forEach((element) => {
        observer.observe(element);
    });

    (function closeMobileMenuOnNavLink() {
        const menu = document.querySelector(".header__menu");
        const menuToggle = document.getElementById("header__menuToggle");
        const submenuToggle = document.getElementById("header__submenuToggle");
        if (!menu || !menuToggle) return;

        menu.addEventListener("click", function (e) {
            const link = e.target.closest && e.target.closest("a[href]");
            if (!link) return;
            if (link.classList.contains("header__menuLink--noLink")) return;
            menuToggle.checked = false;
            menuToggle.dispatchEvent(new Event("change"));
            if (submenuToggle) submenuToggle.checked = false;
        });
    })();

    if (typeof Swiper !== "undefined") {
    // TESTIMONIALS SLIDER
    const swiperContainer = document.querySelector(".mySwiper.mySwiper--testimonials");
    const swiperWrapper = swiperContainer?.querySelector(".swiper-wrapper");
    let swiperInstance = null;
    let originalHTML = null;

    function reorganizeSlides() {
        if (!swiperWrapper) return;

        const isMobile = window.innerWidth <= 800;

        if (!originalHTML) {
            originalHTML = swiperWrapper.innerHTML;
        }

        swiperWrapper.innerHTML = originalHTML;

        if (isMobile) {
            const allCards = Array.from(swiperWrapper.querySelectorAll(".testimonials__card"));
            const newSlides = [];

            allCards.forEach((card) => {
                const slide = document.createElement("div");
                slide.className = "swiper-slide";
                slide.appendChild(card);
                newSlides.push(slide);
            });

            swiperWrapper.innerHTML = "";
            newSlides.forEach((slide) => swiperWrapper.appendChild(slide));
        }

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
                type: "bullets",
            },
        });
    }

    if (swiperContainer) {
        reorganizeSlides();
        window.addEventListener("resize", debounceResize(reorganizeSlides, 250));
    }

    // TEAM SLIDER (≤800px)
    const teamContainer = document.querySelector(".mySwiper.mySwiper--team");
    let teamSwiperInstance = null;

    function initTeamSwiper() {
        if (!teamContainer) return;
        const isSlider = window.innerWidth <= 800;

        if (isSlider && !teamSwiperInstance) {
            teamSwiperInstance = new Swiper(".mySwiper.mySwiper--team", {
                slidesPerView: 1.2,
                slidesPerGroup: 1,
                spaceBetween: 16,
                speed: 600,
                navigation: {
                    nextEl: ".swiper-button-next--team",
                    prevEl: ".swiper-button-prev--team",
                },
                pagination: {
                    el: ".swiper-pagination.swiper-pagination--team",
                    clickable: true,
                    dynamicBullets: false,
                    type: "bullets",
                },
            });
        } else if (!isSlider && teamSwiperInstance) {
            teamSwiperInstance.destroy(true, true);
            teamSwiperInstance = null;
        }
    }

    if (teamContainer) {
        initTeamSwiper();
        window.addEventListener(
            "resize",
            debounceResize(function () {
                if (teamSwiperInstance) {
                    teamSwiperInstance.destroy(true, true);
                    teamSwiperInstance = null;
                }
                initTeamSwiper();
            }, 250)
        );
    }

    // WHY SUNO SLIDER
    const whySunoEl = document.querySelector(".mySwiper.mySwiper--whySuno");
    let whySunoSwiper = null;
    if (whySunoEl) {
        whySunoSwiper = new Swiper(".mySwiper.mySwiper--whySuno", {
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
                nextEl: ".swiper-button-next--whySuno",
                prevEl: ".swiper-button-prev--whySuno",
            },
            pagination: {
                el: ".swiper-pagination.swiper-pagination--whySuno",
                clickable: true,
                dynamicBullets: false,
                type: "bullets",
            },
        });
        window.addEventListener(
            "resize",
            debounceResize(function () {
                if (whySunoSwiper) whySunoSwiper.update();
            }, 250)
        );
    }

    // STRUCTURE SLIDER (coverflow)
    const structureContainer = document.querySelector(".mySwiper.mySwiper--structure");
    let structureSwiper = null;
    if (structureContainer) {
        structureSwiper = new Swiper(".mySwiper.mySwiper--structure", {
            // loop + coverflow + slidesPerView:"auto" desalinha o track e a paginação no Swiper 12
            rewind: true,
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            // Índice 2 = 3.º slide: com coverflow e slides largos, o 1.º fica colado à esquerda sem par na esquerda
            initialSlide: 2,
            watchSlidesProgress: true,
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
                nextEl: ".swiper-button-next--structure",
                prevEl: ".swiper-button-prev--structure",
            },
            pagination: {
                el: ".swiper-pagination.swiper-pagination--structure",
                clickable: true,
                dynamicBullets: false,
                type: "bullets",
            },
        });
        window.addEventListener(
            "resize",
            debounceResize(function () {
                if (structureSwiper) structureSwiper.update();
            }, 250)
        );
    }

    // VIDEO TESTIMONIALS SLIDER
    const videoTestimonialsEl = document.querySelector(".mySwiper.mySwiper--videoTestimonials");
    let videoTestimonialsSwiper = null;
    if (videoTestimonialsEl) {
        videoTestimonialsSwiper = new Swiper(".mySwiper.mySwiper--videoTestimonials", {
            loop: true,
            slidesPerView: 1.2,
            slidesPerGroup: 1,
            spaceBetween: 20,
            speed: 600,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            breakpoints: {
                801: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1220: {
                    slidesPerView: 3,
                    spaceBetween: 28,
                },
            },
            navigation: {
                nextEl: ".swiper-button-next--videoTestimonials",
                prevEl: ".swiper-button-prev--videoTestimonials",
            },
            pagination: {
                el: ".swiper-pagination.swiper-pagination--videoTestimonials",
                clickable: true,
                dynamicBullets: false,
                type: "bullets",
            },
        });
        window.addEventListener(
            "resize",
            debounceResize(function () {
                if (videoTestimonialsSwiper) videoTestimonialsSwiper.update();
            }, 250)
        );
    }

    } // end Swiper

    // VIDEO TESTIMONIALS MODAL
    const modal = document.getElementById("videoTestimonialsModal");
    const modalIframe = document.getElementById("videoTestimonialsModalIframe");
    const modalClose = document.getElementById("videoTestimonialsModalClose");
    const modalBackdrop = document.querySelector(".videoTestimonials__modalBackdrop");
    const cardLinks = document.querySelectorAll(".videoTestimonials .videoTestimonials__cardLink");
    const bodyModalClass = "videoTestimonials__body--modalOpen";
    let videoModalLastFocus = null;

    function getModalFocusables() {
        if (!modal) return [];
        return Array.prototype.slice
            .call(
                modal.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            )
            .filter(function (el) {
                return el.offsetWidth > 0 || el.offsetHeight > 0 || el === modalClose;
            });
    }

    function getYouTubeVideoId(url) {
        if (!url) return null;
        try {
            const u = new URL(url);
            if (u.hostname === "www.youtu.be" || u.hostname === "youtu.be") return u.pathname.slice(1) || null;
            if (u.hostname.includes("youtube.com") && u.searchParams.has("v")) return u.searchParams.get("v");
        } catch (_) {}
        return null;
    }

    function openModal(videoId) {
        if (!modal || !modalIframe || !videoId) return;
        videoModalLastFocus = document.activeElement;
        modalIframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
        modal.classList.add("videoTestimonials__modal--open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add(bodyModalClass);
        if (modalClose) modalClose.focus();
    }

    function closeModal() {
        if (!modal || !modalIframe) return;
        modal.classList.remove("videoTestimonials__modal--open");
        modal.setAttribute("aria-hidden", "true");
        modalIframe.src = "";
        document.body.classList.remove(bodyModalClass);
        if (videoModalLastFocus && typeof videoModalLastFocus.focus === "function") {
            videoModalLastFocus.focus();
        }
        videoModalLastFocus = null;
    }

    cardLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            const videoId = getYouTubeVideoId(link.getAttribute("href") || "");
            if (!videoId) return;
            e.preventDefault();
            openModal(videoId);
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", function (e) {
        if (!modal || !modal.classList.contains("videoTestimonials__modal--open")) return;
        if (e.key === "Escape") {
            closeModal();
            return;
        }
        if (e.key !== "Tab") return;
        const list = getModalFocusables();
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
});

(function initHubSpotFormLazy() {
    const targetEl = document.getElementById("contact-form");
    if (!targetEl) return;
    const portalId = targetEl.getAttribute("data-hubspot-portal");
    const formId = targetEl.getAttribute("data-hubspot-form");
    const region = targetEl.getAttribute("data-hubspot-region") || "na1";
    if (!portalId || !formId) return;

    let formCreated = false;

    function tryCreateForm() {
        if (formCreated || typeof hbspt === "undefined" || !hbspt.forms) return false;
        formCreated = true;
        hbspt.forms.create({
            region: region,
            portalId: portalId,
            formId: formId,
            target: "#contact-form",
        });
        return true;
    }

    function loadHubSpotScript(done) {
        if (document.getElementById("hs-forms-loader")) {
            done();
            return;
        }
        const s = document.createElement("script");
        s.id = "hs-forms-loader";
        s.charset = "utf-8";
        s.async = true;
        s.src = "https://js.hsforms.net/forms/v2.js";
        s.onload = done;
        document.body.appendChild(s);
    }

    function startHubSpot() {
        loadHubSpotScript(function () {
            let tries = 0;
            const t = setInterval(function () {
                tries += 1;
                if (tryCreateForm() || tries > 80) clearInterval(t);
            }, 100);
        });
    }

    function whenReady() {
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            io.disconnect();
                            startHubSpot();
                        }
                    });
                },
                { rootMargin: "140px 0px", threshold: 0.01 }
            );
            io.observe(targetEl);
        } else {
            startHubSpot();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", whenReady);
    } else {
        whenReady();
    }
})();
