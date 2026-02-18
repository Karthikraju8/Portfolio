/* ============================================
   K KARTHIK RAJU - PORTFOLIO SCRIPTS
   Animations, Particles, Interactions
   ============================================ */

(function () {
    'use strict';

    /* ---- Config ---- */
    const CONFIG = {
        particleCount: window.innerWidth < 768 ? 40 : 80,
        connectionDistance: 120,
        mouseRadius: 150,
        scrambleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!',
        typewriterStrings: [
            'Cloud Infrastructure Architect',
            'Full-Stack Developer',
            'AWS Solutions Specialist',
            'Project Manager'
        ],
        typeSpeed: 70,
        deleteSpeed: 35,
        pauseTime: 2000
    };

    /* ==============================
       PRELOADER
       ============================== */
    function initPreloader() {
        const preloaderText = document.getElementById('preloader-text');
        const barFill = document.getElementById('preloader-bar-fill');
        const preloader = document.getElementById('preloader');
        const targetText = 'KARTHIK RAJU';
        let progress = 0;

        // Text scramble effect
        const textLength = targetText.length;
        const resolved = new Array(textLength).fill(false);
        const display = new Array(textLength).fill(' ');

        function scrambleTick() {
            let allResolved = true;
            for (let i = 0; i < textLength; i++) {
                if (!resolved[i]) {
                    if (Math.random() < 0.08 + (progress / 100) * 0.15) {
                        resolved[i] = true;
                        display[i] = targetText[i];
                    } else {
                        display[i] = CONFIG.scrambleChars[Math.floor(Math.random() * CONFIG.scrambleChars.length)];
                        allResolved = false;
                    }
                }
            }
            preloaderText.textContent = display.join('');
            return allResolved;
        }

        const scrambleInterval = setInterval(() => {
            progress += 2;
            barFill.style.width = Math.min(progress, 100) + '%';
            const done = scrambleTick();
            if (done && progress >= 100) {
                clearInterval(scrambleInterval);
                preloaderText.textContent = targetText;
                setTimeout(hidePreloader, 400);
            }
        }, 40);

        function hidePreloader() {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    animateHero();
                    document.getElementById('side-nav').classList.add('visible');
                }
            });
        }
    }

    /* ==============================
       CUSTOM CURSOR
       ============================== */
    function initCursor() {
        if (window.innerWidth < 768) return;

        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, .btn, .chip, .cert-card, .magnetic');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('hovering');
                ring.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('hovering');
                ring.classList.remove('hovering');
            });
        });
    }

    /* ==============================
       PARTICLE CANVAS
       ============================== */
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        let animFrame;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.8 + 0.5;
                this.baseOpacity = Math.random() * 0.4 + 0.1;
                this.opacity = this.baseOpacity;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONFIG.mouseRadius) {
                        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                        this.x += dx * force * 0.015;
                        this.y += dy * force * 0.015;
                        this.opacity = this.baseOpacity + force * 0.4;
                    } else {
                        this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONFIG.connectionDistance) {
                        const opacity = (1 - dist / CONFIG.connectionDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        // Mouse connections
        function drawMouseConnections() {
            if (mouse.x === null || mouse.y === null) return;
            for (let i = 0; i < particles.length; i++) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.mouseRadius) {
                    const opacity = (1 - dist / CONFIG.mouseRadius) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            drawMouseConnections();
            animFrame = requestAnimationFrame(animate);
        }
        animate();
    }

    /* ==============================
       HERO ANIMATIONS
       ============================== */
    function animateHero() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Split hero name into characters
        const heroName = document.getElementById('hero-name');
        const originalHTML = heroName.innerHTML;
        const text = heroName.textContent;
        let charHTML = '';
        let inTag = false;

        // Rebuild with char spans, preserving <br> and <span>
        for (let i = 0; i < originalHTML.length; i++) {
            if (originalHTML[i] === '<') {
                inTag = true;
                // Find the full tag
                const closeIdx = originalHTML.indexOf('>', i);
                const tag = originalHTML.substring(i, closeIdx + 1);
                charHTML += tag;
                i = closeIdx;
                continue;
            }
            if (originalHTML[i] === '&') {
                // Skip HTML entities
                const semiIdx = originalHTML.indexOf(';', i);
                charHTML += originalHTML.substring(i, semiIdx + 1);
                i = semiIdx;
                continue;
            }
            if (!inTag) {
                charHTML += `<span class="char" style="display:inline-block;opacity:0;transform:translateY(80px) rotateX(-40deg)">${originalHTML[i] === ' ' ? '&nbsp;' : originalHTML[i]}</span>`;
            }
        }

        heroName.innerHTML = charHTML;
        heroName.style.opacity = 1;

        // Animate
        tl.to('.hero-tag', { opacity: 1, duration: 0.6 }, 0)
          .to('.hero-tag-line', { width: 40, duration: 0.6 }, 0.1)
          .to('.hero-name .char', {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.7,
              stagger: 0.03,
              ease: 'back.out(1.5)'
          }, 0.3)
          .to('.hero-title-wrapper', { opacity: 1, duration: 0.5 }, 0.8)
          .to('.hero-description', { opacity: 1, duration: 0.5 }, 1)
          .to('.hero-cta', { opacity: 1, duration: 0.5 }, 1.1)
          .to('.hero-stats', { opacity: 1, duration: 0.5 }, 1.2)
          .to('.scroll-indicator', { opacity: 1, duration: 0.5 }, 1.4);

        // Start typewriter after hero animation
        setTimeout(initTypewriter, 1200);
        setTimeout(animateStats, 1400);
    }

    /* ==============================
       TYPEWRITER
       ============================== */
    function initTypewriter() {
        const el = document.getElementById('typewriter');
        const strings = CONFIG.typewriterStrings;
        let stringIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function tick() {
            const current = strings[stringIdx];

            if (!isDeleting) {
                el.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(tick, CONFIG.pauseTime);
                    return;
                }
                setTimeout(tick, CONFIG.typeSpeed);
            } else {
                el.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    stringIdx = (stringIdx + 1) % strings.length;
                    setTimeout(tick, 300);
                    return;
                }
                setTimeout(tick, CONFIG.deleteSpeed);
            }
        }
        tick();
    }

    /* ==============================
       STAT COUNTER ANIMATION
       ============================== */
    function animateStats() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const value = target * ease;
                el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    /* ==============================
       SCROLL PROGRESS BAR
       ============================== */
    function initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            bar.style.width = progress + '%';
        });
    }

    /* ==============================
       SIDE NAV ACTIVE STATE
       ============================== */
    function initNavigation() {
        const sections = document.querySelectorAll('.section');
        const navDots = document.querySelectorAll('.nav-dot');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navDots.forEach(dot => {
                        dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(s => observer.observe(s));

        // Smooth scroll on nav click
        navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(dot.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* ==============================
       GSAP SCROLL ANIMATIONS
       ============================== */
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                x: -60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // About text reveals
        gsap.utils.toArray('.reveal-text').forEach((text, i) => {
            gsap.to(text, {
                scrollTrigger: {
                    trigger: text,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        // Code window
        gsap.to('.code-window', {
            scrollTrigger: {
                trigger: '.code-window',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Code lines stagger
        gsap.from('.code-line', {
            scrollTrigger: {
                trigger: '.code-window',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -20,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            delay: 0.3
        });

        // Skill categories
        gsap.utils.toArray('.skill-category').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Chips stagger within each category
        gsap.utils.toArray('.skill-category').forEach(cat => {
            gsap.from(cat.querySelectorAll('.chip'), {
                scrollTrigger: {
                    trigger: cat,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.8,
                y: 10,
                duration: 0.4,
                stagger: 0.04,
                ease: 'back.out(1.5)',
                delay: 0.3
            });
        });

        // Certifications title
        gsap.to('.certs-title', {
            scrollTrigger: {
                trigger: '.certs-title',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });

        // Cert cards
        gsap.utils.toArray('.cert-card').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.08,
                ease: 'power3.out'
            });
        });

        // Timeline
        // Line fill on scroll
        gsap.to('#timeline-fill', {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1
            },
            height: '100%',
            ease: 'none'
        });

        // Timeline entries
        gsap.utils.toArray('.timeline-entry').forEach((entry, i) => {
            const side = entry.dataset.side;
            gsap.to(entry, {
                scrollTrigger: {
                    trigger: entry,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out'
            });

            // Details stagger
            gsap.from(entry.querySelectorAll('.timeline-details li'), {
                scrollTrigger: {
                    trigger: entry,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: side === 'right' ? 30 : -30,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.out',
                delay: 0.3
            });

            // Tags stagger
            gsap.from(entry.querySelectorAll('.timeline-tags span'), {
                scrollTrigger: {
                    trigger: entry,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.7,
                duration: 0.3,
                stagger: 0.05,
                ease: 'back.out(2)',
                delay: 0.6
            });
        });

        // Education cards
        gsap.utils.toArray('.edu-card').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        // Terminal window
        gsap.to('.terminal-window', {
            scrollTrigger: {
                trigger: '.terminal-window',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Terminal lines stagger
        gsap.from('.terminal-line', {
            scrollTrigger: {
                trigger: '.terminal-window',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -20,
            duration: 0.3,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 0.3
        });

        // Contact actions
        gsap.to('.contact-actions', {
            scrollTrigger: {
                trigger: '.contact-actions',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });

        // Footer
        gsap.from('.footer-content', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    /* ==============================
       MAGNETIC BUTTONS
       ============================== */
    function initMagneticButtons() {
        if (window.innerWidth < 768) return;

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { btn.style.transition = ''; }, 400);
            });
        });
    }

    /* ==============================
       3D CARD TILT
       ============================== */
    function initCardTilt() {
        if (window.innerWidth < 768) return;

        const tiltCards = document.querySelectorAll('.timeline-card, .edu-card, .skill-category');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });
    }

    /* ==============================
       INITIALIZATION
       ============================== */
    function init() {
        initPreloader();
        initCursor();
        initParticles();
        initScrollProgress();
        initNavigation();
        initScrollAnimations();
        initMagneticButtons();
        initCardTilt();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
