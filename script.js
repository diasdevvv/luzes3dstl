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
    const checkoutButtons = document.querySelectorAll('a[href*="wiapy.com"]');
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

        const links = document.querySelectorAll('a[href*="wiapy.com"]');
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
