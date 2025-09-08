// выравнивает блоки по контейнеру (contact us и .contact__info) 
function alignElements() {
    const container = document.querySelector('.container--sm');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const elements = document.querySelectorAll('.subtitle, .contact__info');
    
    elements.forEach(element => {
        const parentRect = element.parentElement.getBoundingClientRect();
        element.style.marginLeft = `${containerRect.left - parentRect.left}px`;
        element.style.maxWidth = `${containerRect.width}px`;
    });
}

['DOMContentLoaded', 'resize', 'load'].forEach(event => {
    window.addEventListener(event, alignElements);
});

if ('ResizeObserver' in window) {
    new ResizeObserver(alignElements).observe(document.querySelector('.container--sm'));
}


// Слайдер с отзывами
var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        loop: true,
    },
});

// фиксированное меню
window.addEventListener('scroll', function() {
    const headerSticky = document.querySelector('.header-sticky');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) { 
        headerSticky.style.top = '0';
        headerSticky.style.transform = 'translateY(0)';
    } else {
        headerSticky.style.top = '-100px';
        headerSticky.style.transform = 'translateY(-100%)';
    }
});

//Анимированные заголовки

document.addEventListener('DOMContentLoaded', function() {
    initTextAnimations();
});

function initTextAnimations() {
    const headingContents = document.querySelectorAll('.neuros-heading-content');
    if (!headingContents.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const headingContent = entry.target;
                animateTextElement(headingContent);
                
                observer.unobserve(headingContent);
            }
        });
    }, {
        threshold: 0.3, 
        rootMargin: '0px 0px -50px 0px' 
    });

    headingContents.forEach(headingContent => {
        const letters = headingContent.querySelectorAll('.letter');
        letters.forEach(letter => {
            letter.style.opacity = '0';
            letter.style.transform = 'translateY(120%)';
        });
        
        observer.observe(headingContent);
    });
}

function animateTextElement(headingContent) {
    const words = headingContent.querySelectorAll('.word');
    const allLetters = [];
    
    words.forEach(word => {
        const letters = word.querySelectorAll('.letter');
        letters.forEach(letter => {
            allLetters.push(letter);
        });
    });
    
    animateLettersSequentially(allLetters);
}

function animateLettersSequentially(letters) {
    letters.forEach((letter, index) => {
        const delay = index * 40; 
        
        setTimeout(() => {
            letter.style.animation = 'fadeInUp 0.7s cubic-bezier(0.26, -0.14, 0, 1.01) forwards';
        }, delay);
    });
}

//Прелоадер и инициализация wow.js
document.addEventListener('DOMContentLoaded', function() {
    const wowElements = document.querySelectorAll('.wow');
    wowElements.forEach(element => {
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
    });

    const preloader = document.getElementById('preloader');
    let wowInitialized = false;
    
    let progress = 0;
    const totalTime = 3000;
    const interval = 30;
    
    const progressInterval = setInterval(() => {
        progress += (interval / totalTime) * 100;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    
                    if (!wowInitialized) {
                        initWowJs();
                        wowInitialized = true;
                    }
                }, 300);
            }, 300);
        }
    }, interval);

    function initWowJs() {
        new WOW({
            boxClass: 'wow',
            animateClass: 'animate__animated',
            offset: 100,
            mobile: true,
            live: true,
            callback: function(box) {
                setTimeout(() => {
                    box.style.visibility = 'visible';
                    box.style.opacity = '1';
                }, 100);
            }
        }).init();
        
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
            
            wowElements.forEach(element => {
                element.style.visibility = 'visible';
            });
        }, 100);
    }

    setTimeout(function() {
        if (!wowInitialized) {
            preloader.style.display = 'none';
            initWowJs();
            wowInitialized = true;
        }
    }, 5000);
});

//Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const headerMenuLinks = document.querySelectorAll('.header__menu-link'); // Добавляем селектор для ссылок основного меню
    const body = document.body;

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }

    burgerMenu.addEventListener('click', toggleMenu);

    overlay.addEventListener('click', toggleMenu);

    // Обработчик для ссылок мобильного меню
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                toggleMenu();
                
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300); 
            }
        });
    });

    // Обработчик для ссылок основного меню (header__menu-link)
    headerMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Закрываем меню, если оно открыто
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
            
            // Дополнительно: если ссылка ведет на якорь, добавляем плавную прокрутку
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    setTimeout(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
    });

    document.addEventListener('touchmove', function(e) {
        if (mobileMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});
