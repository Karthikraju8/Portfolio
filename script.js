/* =============================================
   K KARTHIK RAJU — PORTFOLIO v3
   Performance-Optimized — Light Blue Theme
   ============================================= */
(function () {
    'use strict';

    const CFG = {
        scramble: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&',
        typeStrings: [
            'Cloud Infrastructure Architect',
            'Full-Stack Developer',
            'AWS Solutions Specialist',
            'Project Manager'
        ],
        typeSpeed: 65,
        delSpeed: 30,
        pauseTime: 2200
    };

    let mouse = { x: 0, y: 0 };
    let lenis;
    const isMobile = window.innerWidth < 768;

    /* ===========================================
       PRELOADER
       =========================================== */
    function initPreloader() {
        const counter = document.getElementById('pl-counter');
        const textEl = document.getElementById('pl-text');
        const preloader = document.getElementById('preloader');
        const target = 'KARTHIK RAJU';
        const len = target.length;
        const resolved = Array(len).fill(false);
        const display = Array(len).fill(' ');
        let pct = 0;

        const iv = setInterval(() => {
            pct += Math.random() * 4 + 1;
            if (pct > 100) pct = 100;
            counter.textContent = Math.floor(pct);

            for (let i = 0; i < len; i++) {
                if (!resolved[i]) {
                    if (Math.random() < 0.04 + (pct / 100) * 0.18) {
                        resolved[i] = true;
                        display[i] = target[i];
                    } else {
                        display[i] = CFG.scramble[Math.floor(Math.random() * CFG.scramble.length)];
                    }
                }
            }
            textEl.textContent = display.join('');

            if (pct >= 100 && resolved.every(Boolean)) {
                clearInterval(iv);
                textEl.textContent = target;
                counter.textContent = '100';
                setTimeout(() => {
                    gsap.to(preloader, {
                        clipPath: 'circle(0% at 50% 50%)',
                        duration: 1,
                        ease: 'power4.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            document.body.classList.add('loaded');
                            startHeroAnim();
                            document.getElementById('sidenav').classList.add('vis');
                        }
                    });
                }, 400);
            }
        }, 35);

        preloader.style.clipPath = 'circle(100% at 50% 50%)';
    }

    /* ===========================================
       LENIS SMOOTH SCROLL
       =========================================== */
    function initLenis() {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 1.5,
            syncTouch: true
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    /* ===========================================
       THREE.JS — Pauses when off-screen
       =========================================== */
    function initThree() {
        const canvas = document.getElementById('three-canvas');
        const w = window.innerWidth;
        const h = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

        // Wireframe Icosahedron
        const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
        const wireGeo = new THREE.WireframeGeometry(icoGeo);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.12 });
        const ico = new THREE.LineSegments(wireGeo, wireMat);
        scene.add(ico);

        // Inner icosahedron
        const icoGeo2 = new THREE.IcosahedronGeometry(1.4, 1);
        const wireGeo2 = new THREE.WireframeGeometry(icoGeo2);
        const wireMat2 = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.08 });
        const ico2 = new THREE.LineSegments(wireGeo2, wireMat2);
        scene.add(ico2);

        // Particles — reduced count
        const pCount = isMobile ? 80 : 200;
        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.025, transparent: true, opacity: 0.5 });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        // Single ring
        const ringGeo = new THREE.TorusGeometry(3.2, 0.008, 16, 80);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.06 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        scene.add(ring);

        let targetRotX = 0, targetRotY = 0;

        if (!isMobile) {
            window.addEventListener('mousemove', (e) => {
                targetRotY = (e.clientX / w - 0.5) * 0.6;
                targetRotX = (e.clientY / h - 0.5) * 0.4;
            }, { passive: true });
        }

        window.addEventListener('resize', () => {
            const nw = window.innerWidth;
            const nh = window.innerHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        });

        // Pause Three.js when hero is not visible
        let threeVisible = true;
        const heroObs = new IntersectionObserver(entries => {
            threeVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        heroObs.observe(document.getElementById('hero'));

        function animate() {
            requestAnimationFrame(animate);

            // Skip rendering when off-screen
            if (!threeVisible) return;

            ico.rotation.y += 0.002;
            ico.rotation.x += (targetRotX * 0.4 - ico.rotation.x) * 0.015;
            ico.rotation.y += (targetRotY * 0.4 - ico.rotation.y) * 0.01;

            ico2.rotation.y -= 0.003;
            ico2.rotation.x += (targetRotX * 0.2 - ico2.rotation.x) * 0.01;

            points.rotation.y += 0.0003;
            ring.rotation.z += 0.001;

            renderer.render(scene, camera);
        }
        animate();
    }

    /* ===========================================
       CUSTOM CURSOR
       =========================================== */
    function initCursor() {
        if (isMobile) return;

        const cur = document.getElementById('cur');
        const ring = document.getElementById('cur-ring');
        const glow = document.getElementById('mouse-glow');
        const trails = [];
        for (let i = 0; i < 5; i++) {
            trails.push({ el: document.getElementById('cur-trail-' + i), x: -100, y: -100 });
        }

        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            cur.style.left = mouse.x + 'px';
            cur.style.top = mouse.y + 'px';
            glow.style.left = mouse.x + 'px';
            glow.style.top = mouse.y + 'px';
        }, { passive: true });

        function animRing() {
            ringX += (mouse.x - ringX) * 0.12;
            ringY += (mouse.y - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            for (let i = trails.length - 1; i > 0; i--) {
                trails[i].x += (trails[i - 1].x - trails[i].x) * 0.25;
                trails[i].y += (trails[i - 1].y - trails[i].y) * 0.25;
            }
            trails[0].x += (mouse.x - trails[0].x) * 0.3;
            trails[0].y += (mouse.y - trails[0].y) * 0.3;

            for (let i = 0; i < trails.length; i++) {
                const t = trails[i];
                t.el.style.left = t.x + 'px';
                t.el.style.top = t.y + 'px';
            }

            requestAnimationFrame(animRing);
        }
        animRing();

        document.querySelectorAll('a,button,.btn-mag,.tool-chip,.cert-item,.exp-card,.edu-card,.sp-item').forEach(el => {
            el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
        });
    }

    /* ===========================================
       HERO ANIMATION
       =========================================== */
    function startHeroAnim() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.to('.hero-tag', { opacity: 1, duration: 0.6 }, 0);
        tl.from('.hero-tag-line', { width: 0, duration: 0.6 }, 0.1);

        tl.to('.hero-line-inner', {
            y: 0, duration: 1, stagger: 0.15, ease: 'power4.out',
            onComplete: () => {
                document.querySelectorAll('.hero-line:not(.stroke) .hero-line-inner').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        }, 0.3);

        tl.to('.hero-type-wrap', { opacity: 1, y: 0, duration: 0.5 }, 0.9);
        tl.to('.hero-desc', { opacity: 1, y: 0, duration: 0.5 }, 1.1);
        tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.5 }, 1.2);
        tl.to('.hero-stats-col', { opacity: 1, duration: 0.5 }, 1.3);
        tl.from('.hero-stat', { y: 25, opacity: 0, stagger: 0.1, duration: 0.5 }, 1.35);
        tl.to('.scroll-hint', { opacity: 1, duration: 0.5 }, 1.6);

        setTimeout(initTypewriter, 1100);
        setTimeout(animCounters, 1500);
    }

    /* ===========================================
       TYPEWRITER
       =========================================== */
    function initTypewriter() {
        const el = document.getElementById('typewriter');
        const strs = CFG.typeStrings;
        let si = 0, ci = 0, del = false;

        function tick() {
            const s = strs[si];
            if (!del) {
                el.textContent = s.substring(0, ci + 1);
                ci++;
                if (ci === s.length) { del = true; setTimeout(tick, CFG.pauseTime); return; }
                setTimeout(tick, CFG.typeSpeed);
            } else {
                el.textContent = s.substring(0, ci - 1);
                ci--;
                if (ci === 0) { del = false; si = (si + 1) % strs.length; setTimeout(tick, 350); return; }
                setTimeout(tick, CFG.delSpeed);
            }
        }
        tick();
    }

    /* ===========================================
       COUNTER ANIMATION
       =========================================== */
    function animCounters() {
        document.querySelectorAll('.counter').forEach(el => {
            const tgt = parseFloat(el.dataset.target);
            const dec = tgt % 1 !== 0;
            const dur = 2000;
            const start = performance.now();
            function upd(now) {
                const p = Math.min((now - start) / dur, 1);
                const e = 1 - Math.pow(1 - p, 4);
                el.textContent = dec ? (tgt * e).toFixed(1) : Math.floor(tgt * e);
                if (p < 1) requestAnimationFrame(upd);
                else el.textContent = dec ? tgt.toFixed(1) : tgt;
            }
            requestAnimationFrame(upd);
        });
    }

    /* ===========================================
       SCROLL PROGRESS
       =========================================== */
    function initScrollProg() {
        const bar = document.getElementById('scroll-prog');
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    bar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ===========================================
       NAVIGATION
       =========================================== */
    function initNav() {
        const secs = document.querySelectorAll('.sec');
        const dots = document.querySelectorAll('.sn');

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const id = e.target.id;
                    dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + id));
                }
            });
        }, { threshold: 0.3 });

        secs.forEach(s => obs.observe(s));

        dots.forEach(d => {
            d.addEventListener('click', e => {
                e.preventDefault();
                const t = document.querySelector(d.getAttribute('href'));
                if (t) lenis.scrollTo(t, { offset: 0 });
            });
        });
    }

    /* ===========================================
       GSAP SCROLL ANIMATIONS — Simplified for perf
       =========================================== */
    function initScrollAnims() {
        // Section headers
        gsap.utils.toArray('.sec-head').forEach(h => {
            gsap.from(h, {
                scrollTrigger: { trigger: h, start: 'top 85%' },
                x: -60, opacity: 0, duration: 0.8, ease: 'power3.out'
            });
        });

        // Split reveal text
        gsap.utils.toArray('.split-reveal').forEach((el, i) => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
            });
        });

        // Code window
        gsap.to('.code-win', {
            scrollTrigger: { trigger: '.code-win', start: 'top 80%' },
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
        });
        gsap.from('.cl', {
            scrollTrigger: { trigger: '.code-win', start: 'top 75%' },
            opacity: 0, x: -20, stagger: 0.04, duration: 0.3, ease: 'power2.out', delay: 0.3
        });

        // ===== SKILLS HORIZONTAL SCROLL (desktop only) =====
        const track = document.getElementById('hscroll-track');
        if (track && !isMobile) {
            const totalScroll = track.scrollWidth - window.innerWidth;
            gsap.to(track, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.skills-sec',
                    pin: true,
                    scrub: 1.5,
                    end: () => '+=' + totalScroll,
                    invalidateOnRefresh: true,
                    onUpdate: () => {
                        track.querySelectorAll('.ring-fill').forEach(ring => {
                            const rect = ring.closest('.sp-item').getBoundingClientRect();
                            if (rect.left < window.innerWidth && rect.right > 0) {
                                const pct = parseFloat(ring.dataset.pct) || 0;
                                const c = 2 * Math.PI * 52;
                                ring.style.strokeDashoffset = c - (c * pct / 100);
                            }
                        });
                    }
                }
            });
        } else {
            // Mobile: simple ring animation
            gsap.utils.toArray('.ring-fill').forEach(ring => {
                gsap.to(ring, {
                    scrollTrigger: { trigger: ring, start: 'top 90%' },
                    strokeDashoffset: () => {
                        const pct = parseFloat(ring.dataset.pct) || 0;
                        const c = 2 * Math.PI * 52;
                        return c - (c * pct / 100);
                    },
                    duration: 1,
                    ease: 'power3.out'
                });
            });
        }

        // Skill items — simple fade in
        gsap.utils.toArray('.skill-panel').forEach(panel => {
            gsap.from(panel.querySelectorAll('.sp-item'), {
                scrollTrigger: { trigger: panel, start: 'top 85%' },
                opacity: 0, y: 25, stagger: 0.04, duration: 0.4, ease: 'power2.out'
            });
        });

        // Tool chips & certs
        let toolsAnimated = false;
        function checkToolsPanel() {
            if (toolsAnimated) return;
            const toolsPanel = document.querySelector('.sp-tools');
            if (!toolsPanel) return;
            const rect = toolsPanel.getBoundingClientRect();
            if (rect.left < window.innerWidth * 0.9 && rect.right > 0) {
                toolsAnimated = true;
                gsap.from('.tool-chip', { opacity: 0, y: 15, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
                gsap.from('.cert-item', { opacity: 0, x: -25, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.2 });
            }
        }
        if (track && !isMobile) {
            ScrollTrigger.create({
                trigger: '.skills-sec', start: 'top top', end: 'bottom bottom',
                onUpdate: checkToolsPanel
            });
        } else {
            gsap.from('.tool-chip', {
                scrollTrigger: { trigger: '.sp-tools', start: 'top 85%' },
                opacity: 0, y: 15, stagger: 0.05, duration: 0.4, ease: 'power2.out'
            });
            gsap.from('.cert-item', {
                scrollTrigger: { trigger: '.sp-certs', start: 'top 85%' },
                opacity: 0, x: -25, stagger: 0.08, duration: 0.4, ease: 'power2.out'
            });
        }

        // Experience cards
        gsap.utils.toArray('.exp-card').forEach(card => {
            gsap.to(card, {
                scrollTrigger: { trigger: card, start: 'top 82%' },
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
            });
            gsap.from(card.querySelectorAll('.exp-list li'), {
                scrollTrigger: { trigger: card, start: 'top 75%' },
                opacity: 0, x: 25, stagger: 0.06, duration: 0.35, ease: 'power2.out', delay: 0.3
            });
        });

        // Education cards
        gsap.utils.toArray('.edu-card').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: { trigger: card, start: 'top 85%' },
                opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
            });
        });

        // Terminal
        gsap.to('.term-win', {
            scrollTrigger: { trigger: '.term-win', start: 'top 80%' },
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
        });
        gsap.from('.tl', {
            scrollTrigger: { trigger: '.term-win', start: 'top 75%' },
            opacity: 0, x: -15, stagger: 0.05, duration: 0.25, ease: 'power2.out', delay: 0.3
        });

        // Contact buttons
        gsap.to('.contact-btns', {
            scrollTrigger: { trigger: '.contact-btns', start: 'top 90%' },
            opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
        });
    }

    /* ===========================================
       MAGNETIC BUTTONS
       =========================================== */
    function initMagnetic() {
        if (isMobile) return;
        document.querySelectorAll('.btn-mag').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    /* ===========================================
       3D CARD TILT
       =========================================== */
    function initTilt() {
        if (isMobile) return;
        document.querySelectorAll('.exp-card,.edu-card,.hero-stat').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 700, duration: 0.4, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
            });
        });
    }

    /* ===========================================
       INIT
       =========================================== */
    function init() {
        gsap.registerPlugin(ScrollTrigger);
        initPreloader();
        initLenis();
        initThree();
        initCursor();
        initScrollProg();
        initNav();
        initScrollAnims();
        initMagnetic();
        initTilt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
