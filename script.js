// ── Urgency Bar: Countdown até meia-noite ──────────────────────────────────
(function () {
    function updateCountdown() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);
        const diff = midnight - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const pad = n => String(n).padStart(2, '0');
        const el = document.getElementById('urgency-countdown');
        if (el) el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
})();

// ── Purchase Notification Popup ────────────────────────────────────────────
(function () {
    const names = [
        // 20 masculinos
        'Carlos M.', 'Lucas S.', 'Rafael O.', 'Gabriel F.', 'Mateus A.',
        'Felipe R.', 'Bruno C.', 'Diego N.', 'Thiago P.', 'André L.',
        'Rodrigo B.', 'Eduardo V.', 'Gustavo T.', 'Leonardo H.', 'Vinicius M.',
        'João P.', 'Henrique D.', 'Marcelo K.', 'Igor Z.', 'Samuel W.',
        // 5 femininos
        'Ana C.', 'Beatriz L.', 'Camila F.', 'Fernanda R.', 'Juliana S.'
    ];
    const cities = [
        'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG',
        'Curitiba, PR', 'Fortaleza, CE', 'Manaus, AM', 'Salvador, BA',
        'Porto Alegre, RS', 'Recife, PE', 'Goiânia, GO',
        'Brasília, DF', 'Campinas, SP', 'Florianópolis, SC', 'Natal, RN'
    ];

    function initPopup() {
        const popup   = document.getElementById('purchase-popup');
        const nameEl  = document.getElementById('popup-name');
        const viewsEl = document.getElementById('popup-viewers');
        if (!popup || !nameEl || !viewsEl) return;

        let lastIdx = -1;
        function showPopup() {
            let idx;
            do { idx = Math.floor(Math.random() * names.length); } while (idx === lastIdx);
            lastIdx = idx;
            const city    = cities[Math.floor(Math.random() * cities.length)];
            const viewers = Math.floor(Math.random() * 18) + 8;
            nameEl.textContent  = `${names[idx]} · ${city}`;
            viewsEl.textContent = viewers;
            popup.classList.add('show');
            setTimeout(() => { popup.classList.remove('show'); }, 4500);
        }

        setTimeout(function loop() {
            showPopup();
            const next = (Math.floor(Math.random() * 12) + 18) * 1000;
            setTimeout(loop, next + 5000);
        }, 6000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopup);
    } else {
        initPopup();
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Models Carousel
    const modelsSwiper = new Swiper('.models-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });


    // FAQ Accordion logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    // Apply animation classes to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});

// Upsell Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const basicTrigger = document.getElementById('basic-plan-trigger');
    const modal = document.getElementById('upsell-modal');
    
    if (basicTrigger && modal) {
        basicTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });

        // Close modal if clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

// Tracking: InitiateCheckout on Click
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButtons = document.querySelectorAll('a[href*="lowify.com.br/checkout"]');
    checkoutButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (window.fbq) {
                fbq('track', 'InitiateCheckout');
            }
        });
    });

    // Also track popup simulate buy
    const modalPremiumBtn = document.querySelector('#upsell-modal .cta-button');
    if (modalPremiumBtn) {
        modalPremiumBtn.addEventListener('click', () => {
            if (window.fbq) {
                fbq('track', 'InitiateCheckout');
            }
        });
    }
});

// UTM Propagation Script
(function() {
    function getQueryParameters() {
        const params = {};
        const queryString = window.location.search.substring(1);
        if (queryString) {
            const pairs = queryString.split('&');
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
            }
        }
        return params;
    }

    function appendParamsToLinks() {
        const urlParams = getQueryParameters();
        if (Object.keys(urlParams).length === 0) return;

        const links = document.querySelectorAll('a[href*="lowify.com.br"]');
        links.forEach(link => {
            try {
                const url = new URL(link.href);
                for (const key in urlParams) {
                    url.searchParams.set(key, urlParams[key]);
                }
                link.href = url.toString();
            } catch (e) {
                console.error("Error appending UTMs to link:", link.href, e);
            }
        });
    }

    // Run on load and after short delay to catch dynamic elements
    window.addEventListener('load', appendParamsToLinks);
    setTimeout(appendParamsToLinks, 1000);
    setTimeout(appendParamsToLinks, 3000);
})();
