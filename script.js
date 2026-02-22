/* =============================================
   K KARTHIK RAJU — PORTFOLIO v3
   Light Theme + Impressive Animations
   Three.js + Lenis + GSAP + Custom FX
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

    let mouse = { x: 0, y: 0, nx: 0.5, ny: 0.5 };
    let lenis;
    const isMobile = window.innerWidth < 768;

    /* ===========================================
       PRELOADER — counter + text scramble + reveal
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
                    // Smooth scale + fade out
                    gsap.to(preloader, {
                        clipPath: 'circle(0% at 50% 50%)',
                        duration: 1.2,
                        ease: 'power4.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            document.body.classList.add('loaded');
                            startHeroAnim();
                            document.getElementById('sidenav').classList.add('vis');
                        }
                    });
                }, 500);
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

        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    /* ===========================================
       THREE.JS — 3D WIREFRAME + PARTICLES (LIGHT THEME)
       =========================================== */
    function initThree() {
        const canvas = document.getElementById('three-canvas');
        const w = window.innerWidth;
        const h = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Wireframe Icosahedron - adjusted for light theme
        const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
        const wireGeo = new THREE.WireframeGeometry(icoGeo);
        const wireMat = new THREE.LineBasicMaterial({
            color: 0x2563eb,
            transparent: true,
            opacity: 0.12
        });
        const ico = new THREE.LineSegments(wireGeo, wireMat);
        scene.add(ico);

        // Inner icosahedron
        const icoGeo2 = new THREE.IcosahedronGeometry(1.4, 1);
        const wireGeo2 = new THREE.WireframeGeometry(icoGeo2);
        const wireMat2 = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.08
        });
        const ico2 = new THREE.LineSegments(wireGeo2, wireMat2);
        scene.add(ico2);

        // Third shape - dodecahedron for more complexity
        const dodGeo = new THREE.DodecahedronGeometry(1.8, 0);
        const dodWire = new THREE.WireframeGeometry(dodGeo);
        const dodMat = new THREE.LineBasicMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.06
        });
        const dod = new THREE.LineSegments(dodWire, dodMat);
        scene.add(dod);

        // Floating particles - more and varied
        const pCount = isMobile ? 150 : 400;
        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(pCount * 3);
        const colors = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
            // Varied colors: deep blue, blue, sky blue
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.15; colors[i * 3 + 1] = 0.39; colors[i * 3 + 2] = 0.92;
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.23; colors[i * 3 + 1] = 0.51; colors[i * 3 + 2] = 0.96;
            } else {
                colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.91;
            }
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.03,
            transparent: true,
            opacity: 0.6,
            vertexColors: true
        });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        // Ring geometry
        const ringGeo = new THREE.TorusGeometry(3.2, 0.008, 16, 120);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            transparent: true,
            opacity: 0.06
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        scene.add(ring);

        // Second ring
        const ringGeo2 = new THREE.TorusGeometry(2.6, 0.006, 16, 100);
        const ringMat2 = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.04
        });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.x = Math.PI / 1.8;
        ring2.rotation.y = Math.PI / 4;
        scene.add(ring2);

        let targetRotX = 0, targetRotY = 0;

        function onMouseMove(e) {
            targetRotY = (e.clientX / w - 0.5) * 0.8;
            targetRotX = (e.clientY / h - 0.5) * 0.5;
        }
        if (!isMobile) window.addEventListener('mousemove', onMouseMove);

        function onResize() {
            const nw = window.innerWidth;
            const nh = window.innerHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        }
        window.addEventListener('resize', onResize);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Breathing animation
            const breathe = Math.sin(elapsed * 0.5) * 0.05;
            ico.scale.setScalar(1 + breathe);
            ico2.scale.setScalar(1 - breathe * 0.5);

            ico.rotation.y += 0.003;
            ico.rotation.x += (targetRotX * 0.5 - ico.rotation.x) * 0.02;
            ico.rotation.y += (targetRotY * 0.5 - ico.rotation.y) * 0.01;

            ico2.rotation.y -= 0.004;
            ico2.rotation.x += (targetRotX * 0.3 - ico2.rotation.x) * 0.015;

            dod.rotation.y += 0.001;
            dod.rotation.z += 0.002;
            dod.rotation.x = Math.sin(elapsed * 0.3) * 0.3;

            points.rotation.y += 0.0004;
            points.rotation.x = Math.sin(elapsed * 0.2) * 0.1;

            ring.rotation.z += 0.002;
            ring2.rotation.z -= 0.0015;

            renderer.render(scene, camera);
        }
        animate();
    }

    /* ===========================================
       CUSTOM CURSOR + TRAIL
       =========================================== */
    function initCursor() {
        if (isMobile) return;

        const cur = document.getElementById('cur');
        const ring = document.getElementById('cur-ring');
        const trails = [];
        for (let i = 0; i < 5; i++) {
            trails.push({ el: document.getElementById('cur-trail-' + i), x: -100, y: -100 });
        }

        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.nx = e.clientX / window.innerWidth;
            mouse.ny = e.clientY / window.innerHeight;

            cur.style.left = mouse.x + 'px';
            cur.style.top = mouse.y + 'px';

            const glow = document.getElementById('mouse-glow');
            glow.style.left = mouse.x + 'px';
            glow.style.top = mouse.y + 'px';
        });

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

            trails.forEach((t, i) => {
                t.el.style.left = t.x + 'px';
                t.el.style.top = t.y + 'px';
                t.el.style.opacity = 0.25 - i * 0.05;
                t.el.style.width = (5 - i * 0.6) + 'px';
                t.el.style.height = (5 - i * 0.6) + 'px';
            });

            requestAnimationFrame(animRing);
        }
        animRing();

        document.querySelectorAll('a,button,.btn-mag,.tool-chip,.cert-item,.exp-card,.edu-card,.sp-item').forEach(el => {
            el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
        });
    }

    /* ===========================================
       HERO ANIMATION SEQUENCE — MORE IMPRESSIVE
       =========================================== */
    function startHeroAnim() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Tag with spring
        tl.to('.hero-tag', { opacity: 1, duration: 0.8 }, 0);
        tl.from('.hero-tag-line', { width: 0, duration: 0.8, ease: 'power2.inOut' }, 0.1);
        tl.from('.hero-tag span', { x: -20, opacity: 0, duration: 0.6 }, 0.3);

        // Name lines slide up with blur clear
        tl.to('.hero-line-inner', {
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
            onComplete: () => {
                document.querySelectorAll('.hero-line:not(.stroke) .hero-line-inner').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        }, 0.3);

        // Typewriter & desc with slide
        tl.to('.hero-type-wrap', { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.0);
        tl.from('.hero-type-wrap', { y: 15, duration: 0.6, ease: 'power3.out' }, 1.0);

        tl.to('.hero-desc', { opacity: 1, duration: 0.6 }, 1.2);
        tl.from('.hero-desc', { y: 20, duration: 0.6 }, 1.2);

        // Buttons with bounce
        tl.to('.hero-btns', { opacity: 1, duration: 0.5 }, 1.4);
        tl.from('.hero-btns .btn-mag', {
            y: 25, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'back.out(1.7)'
        }, 1.4);

        // Stats with 3D entrance
        tl.to('.hero-stats-col', { opacity: 1, duration: 0.5 }, 1.5);
        tl.from('.hero-stat', {
            y: 40, opacity: 0, scale: 0.8, rotateX: -15,
            stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)'
        }, 1.55);

        // Scroll hint with bounce
        tl.to('.scroll-hint', { opacity: 1, duration: 0.5 }, 1.9);
        tl.from('.scroll-hint', { y: 20, duration: 0.5, ease: 'bounce.out' }, 1.9);

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
       COUNTER ANIMATION — with elastic easing
       =========================================== */
    function animCounters() {
        document.querySelectorAll('.counter').forEach(el => {
            const tgt = parseFloat(el.dataset.target);
            const dec = tgt % 1 !== 0;
            const dur = 2500;
            const start = performance.now();
            function upd(now) {
                const p = Math.min((now - start) / dur, 1);
                // Elastic ease out
                const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p) * Math.cos((p * 10 - 0.75) * (2 * Math.PI / 3));
                const clampedE = Math.min(e, 1);
                el.textContent = dec ? (tgt * clampedE).toFixed(1) : Math.floor(tgt * clampedE);
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
                    const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    bar.style.width = p + '%';
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
       GSAP SCROLL ANIMATIONS — MORE IMPRESSIVE
       =========================================== */
    function initScrollAnims() {

        // Section headers - slide in with stagger
        gsap.utils.toArray('.sec-head').forEach(h => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: h, start: 'top 85%' }
            });
            tl.from(h.querySelector('.sec-num'), {
                scale: 0, rotation: -180, opacity: 0, duration: 0.6, ease: 'back.out(2)'
            }, 0);
            tl.from(h.querySelector('.sec-title'), {
                x: -60, opacity: 0, duration: 0.8, ease: 'power3.out'
            }, 0.15);
            tl.from(h.querySelector('.sec-line'), {
                scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power3.inOut'
            }, 0.3);
        });

        // Split reveal text - staggered with slight rotation
        gsap.utils.toArray('.split-reveal').forEach((el, i) => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                opacity: 1, y: 0, duration: 0.8, delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        // Code window - 3D entrance
        const codeWinTl = gsap.timeline({
            scrollTrigger: { trigger: '.code-win', start: 'top 80%' }
        });
        codeWinTl.to('.code-win', {
            opacity: 1, y: 0, rotateY: 0, duration: 1, ease: 'power3.out'
        }, 0);
        codeWinTl.from('.code-dots i', {
            scale: 0, stagger: 0.08, duration: 0.3, ease: 'back.out(3)'
        }, 0.4);
        codeWinTl.from('.cl', {
            opacity: 0, x: -30, stagger: 0.06, duration: 0.4, ease: 'power2.out'
        }, 0.5);

        // ===== HORIZONTAL SCROLL SKILLS (desktop only) =====
        const track = document.getElementById('hscroll-track');
        if (track && !isMobile) {
            const totalScroll = track.scrollWidth - window.innerWidth;
            gsap.to(track, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.skills-sec',
                    pin: true,
                    scrub: 1,
                    end: () => '+=' + totalScroll,
                    invalidateOnRefresh: true,
                    onUpdate: () => {
                        track.querySelectorAll('.ring-fill').forEach(ring => {
                            const rect = ring.closest('.sp-item').getBoundingClientRect();
                            if (rect.left < window.innerWidth && rect.right > 0) {
                                const pct = parseFloat(ring.dataset.pct) || 0;
                                const circumference = 2 * Math.PI * 52;
                                ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
                            }
                        });
                    }
                }
            });
        } else {
            // Mobile: animate rings on scroll with stagger
            gsap.utils.toArray('.ring-fill').forEach((ring, i) => {
                gsap.to(ring, {
                    scrollTrigger: { trigger: ring, start: 'top 90%' },
                    strokeDashoffset: () => {
                        const pct = parseFloat(ring.dataset.pct) || 0;
                        const c = 2 * Math.PI * 52;
                        return c - (c * pct / 100);
                    },
                    duration: 1.2,
                    delay: (i % 3) * 0.1,
                    ease: 'power3.out'
                });
            });
        }

        // Skill panel items - cascade with 3D
        gsap.utils.toArray('.skill-panel').forEach(panel => {
            gsap.from(panel.querySelectorAll('.sp-item'), {
                scrollTrigger: { trigger: panel, start: 'top 85%' },
                opacity: 0, y: 40, scale: 0.7, rotateY: -15,
                stagger: { each: 0.06, from: 'start' },
                duration: 0.6, ease: 'back.out(1.7)', delay: 0.1
            });
        });

        // Skill panel headers
        gsap.utils.toArray('.sp-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: { trigger: header, start: 'top 85%' },
                opacity: 0, x: -40, duration: 0.7, ease: 'power3.out'
            });
        });

        // Tool chips & cert items
        let toolsAnimated = false;
        function checkToolsPanel() {
            if (toolsAnimated) return;
            const toolsPanel = document.querySelector('.sp-tools');
            if (!toolsPanel) return;
            const rect = toolsPanel.getBoundingClientRect();
            if (rect.left < window.innerWidth * 0.9 && rect.right > 0) {
                toolsAnimated = true;
                gsap.from('.tool-chip', {
                    opacity: 0, scale: 0.5, y: 20,
                    stagger: 0.06, duration: 0.5, ease: 'back.out(2.5)'
                });
                gsap.from('.certs-label', {
                    opacity: 0, y: 15, duration: 0.4, ease: 'power3.out', delay: 0.2
                });
                gsap.from('.cert-item', {
                    opacity: 0, x: -40, scale: 0.95,
                    stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.35
                });
            }
        }

        if (track && !isMobile) {
            ScrollTrigger.create({
                trigger: '.skills-sec',
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: checkToolsPanel
            });
        } else {
            gsap.from('.tool-chip', {
                scrollTrigger: { trigger: '.sp-tools', start: 'top 85%' },
                opacity: 0, scale: 0.5, y: 20,
                stagger: 0.06, duration: 0.5, ease: 'back.out(2.5)'
            });
            gsap.from('.certs-label', {
                scrollTrigger: { trigger: '.sp-certs', start: 'top 90%' },
                opacity: 0, y: 15, duration: 0.4, ease: 'power3.out'
            });
            gsap.from('.cert-item', {
                scrollTrigger: { trigger: '.sp-certs', start: 'top 85%' },
                opacity: 0, x: -40, scale: 0.95,
                stagger: 0.1, duration: 0.6, ease: 'power3.out'
            });
        }

        // Experience cards - dramatic 3D reveal
        gsap.utils.toArray('.exp-card').forEach((card, i) => {
            const cardTl = gsap.timeline({
                scrollTrigger: { trigger: card, start: 'top 82%' }
            });

            cardTl.to(card, {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out'
            }, 0);

            cardTl.from(card.querySelector('.exp-card-inner'), {
                scale: 0.95, duration: 0.6, ease: 'power2.out'
            }, 0.1);

            if (card.querySelector('.exp-badge')) {
                cardTl.from(card.querySelector('.exp-badge'), {
                    scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(3)'
                }, 0.3);
            }

            cardTl.from(card.querySelectorAll('.exp-list li'), {
                opacity: 0, x: 40, stagger: 0.08, duration: 0.4, ease: 'power2.out'
            }, 0.4);

            cardTl.from(card.querySelectorAll('.exp-tags span'), {
                opacity: 0, scale: 0.4, rotation: -10,
                stagger: 0.05, duration: 0.35, ease: 'back.out(2.5)'
            }, 0.7);
        });

        // Education cards - staggered with glow
        gsap.utils.toArray('.edu-card').forEach((card, i) => {
            const eduTl = gsap.timeline({
                scrollTrigger: { trigger: card, start: 'top 85%' }
            });

            eduTl.to(card, {
                opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: 'power3.out'
            }, 0);

            eduTl.from(card.querySelector('.edu-badge'), {
                scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(3)'
            }, 0.3 + i * 0.15);

            eduTl.from(card.querySelector('.edu-glow'), {
                scale: 0, opacity: 0, duration: 1, ease: 'power2.out'
            }, 0.5 + i * 0.15);
        });

        // Terminal - cinematic entrance
        const termTl = gsap.timeline({
            scrollTrigger: { trigger: '.term-win', start: 'top 80%' }
        });
        termTl.to('.term-win', {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out'
        }, 0);
        termTl.from('.term-dots i', {
            scale: 0, stagger: 0.08, duration: 0.3, ease: 'back.out(3)'
        }, 0.3);
        termTl.from('.tl', {
            opacity: 0, x: -25, stagger: 0.07, duration: 0.35, ease: 'power2.out'
        }, 0.45);

        // Contact buttons - bounce in
        gsap.to('.contact-btns', {
            scrollTrigger: { trigger: '.contact-btns', start: 'top 90%' },
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
        });
        gsap.from('.contact-btns .btn-mag', {
            scrollTrigger: { trigger: '.contact-btns', start: 'top 90%' },
            y: 30, opacity: 0, scale: 0.9, stagger: 0.12,
            duration: 0.6, ease: 'back.out(1.7)', delay: 0.2
        });

        // Marquee bands fade in
        gsap.utils.toArray('.marquee-band').forEach((band) => {
            gsap.from(band, {
                scrollTrigger: { trigger: band, start: 'top 95%' },
                opacity: 0, duration: 0.6, ease: 'power3.out'
            });
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
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* ===========================================
       3D CARD TILT — Enhanced
       =========================================== */
    function initTilt() {
        if (isMobile) return;

        document.querySelectorAll('.exp-card,.edu-card,.hero-stat').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 12,
                    rotateX: -y * 12,
                    transformPerspective: 600,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateY: 0, rotateX: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    /* ===========================================
       MARQUEE SCROLL VELOCITY BOOST
       =========================================== */
    function initMarqueeVelocity() {
        const tracks = document.querySelectorAll('.marquee-track');
        let currentSpeed = 1;

        if (lenis) {
            lenis.on('scroll', ({ velocity }) => {
                const target = 1 + Math.abs(velocity) * 0.04;
                currentSpeed += (target - currentSpeed) * 0.1;
            });
        }

        function updateMarquee() {
            tracks.forEach(t => {
                const base = t.closest('.reverse') ? 35 : 30;
                t.style.animationDuration = (base / currentSpeed) + 's';
            });
            currentSpeed += (1 - currentSpeed) * 0.02;
            requestAnimationFrame(updateMarquee);
        }
        updateMarquee();
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
        initMarqueeVelocity();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
