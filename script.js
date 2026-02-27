/* =============================================
   K KARTHIK RAJU — PORTFOLIO v4
   Dark/Light Mode + DRAMATIC Animations
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
    let scrollVelocity = 0;

    /* ===========================================
       THEME TOGGLE (Dark / Light)
       =========================================== */
    function initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';

            // Animate the toggle thumb with a bounce
            const thumb = toggle.querySelector('.toggle-thumb');
            gsap.fromTo(thumb, { scale: 0.7 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });

            if (next === 'light') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            localStorage.setItem('theme', next);
            updateThreeColors(next);
        });
    }

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
                        duration: 1.2,
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

        lenis.on('scroll', (e) => {
            ScrollTrigger.update();
            scrollVelocity = e.velocity;
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    /* ===========================================
       THREE.JS — Enhanced with theme support
       =========================================== */
    let threeObjects = {};

    function updateThreeColors(theme) {
        if (!threeObjects.wireMat) return;
        const isDark = theme === 'dark';
        // Dark: violet wireframe, light: blue
        threeObjects.wireMat.color.setHex(isDark ? 0xa78bfa : 0x2563eb);
        threeObjects.wireMat.opacity = isDark ? 0.22 : 0.12;
        // Dark: cyan inner wireframe, light: blue
        threeObjects.wireMat2.color.setHex(isDark ? 0x22d3ee : 0x3b82f6);
        threeObjects.wireMat2.opacity = isDark ? 0.15 : 0.08;
        // Dark: teal particles, light: blue
        threeObjects.pMat.color.setHex(isDark ? 0x2dd4bf : 0x60a5fa);
        threeObjects.pMat.opacity = isDark ? 0.7 : 0.5;
        threeObjects.pMat.size = isDark ? 0.035 : 0.025;
        // Dark: violet ring, light: blue
        threeObjects.ringMat.color.setHex(isDark ? 0xa78bfa : 0x2563eb);
        threeObjects.ringMat.opacity = isDark ? 0.12 : 0.06;
        if (threeObjects.ring2Mat) {
            threeObjects.ring2Mat.color.setHex(isDark ? 0x22d3ee : 0x3b82f6);
            threeObjects.ring2Mat.opacity = isDark ? 0.08 : 0.04;
        }
    }

    function initThree() {
        const canvas = document.getElementById('three-canvas');
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

        // Wireframe Icosahedron
        const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
        const wireGeo = new THREE.WireframeGeometry(icoGeo);
        const wireMat = new THREE.LineBasicMaterial({ color: isDark ? 0xa78bfa : 0x2563eb, transparent: true, opacity: isDark ? 0.22 : 0.12 });
        const ico = new THREE.LineSegments(wireGeo, wireMat);
        scene.add(ico);

        // Inner icosahedron
        const icoGeo2 = new THREE.IcosahedronGeometry(1.4, 1);
        const wireGeo2 = new THREE.WireframeGeometry(icoGeo2);
        const wireMat2 = new THREE.LineBasicMaterial({ color: isDark ? 0x22d3ee : 0x3b82f6, transparent: true, opacity: isDark ? 0.15 : 0.08 });
        const ico2 = new THREE.LineSegments(wireGeo2, wireMat2);
        scene.add(ico2);

        // Particles — more visible
        const pCount = isMobile ? 60 : 150;
        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({ color: isDark ? 0x2dd4bf : 0x60a5fa, size: isDark ? 0.035 : 0.025, transparent: true, opacity: isDark ? 0.7 : 0.5 });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        // Ring
        const ringGeo = new THREE.TorusGeometry(3.2, 0.008, 16, 80);
        const ringMat = new THREE.MeshBasicMaterial({ color: isDark ? 0xa78bfa : 0x2563eb, transparent: true, opacity: isDark ? 0.12 : 0.06 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        scene.add(ring);

        // Second ring for more visual impact
        const ring2Geo = new THREE.TorusGeometry(2.8, 0.006, 16, 80);
        const ring2Mat = new THREE.MeshBasicMaterial({ color: isDark ? 0x22d3ee : 0x3b82f6, transparent: true, opacity: isDark ? 0.08 : 0.04 });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = Math.PI / 1.8;
        ring2.rotation.y = Math.PI / 4;
        scene.add(ring2);

        threeObjects = { wireMat, wireMat2, pMat, ringMat, ring2Mat };

        let targetRotX = 0, targetRotY = 0;

        if (!isMobile) {
            window.addEventListener('mousemove', (e) => {
                targetRotY = (e.clientX / w - 0.5) * 0.8;
                targetRotX = (e.clientY / h - 0.5) * 0.6;
            }, { passive: true });
        }

        window.addEventListener('resize', () => {
            const nw = window.innerWidth;
            const nh = window.innerHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        });

        let threeVisible = true;
        const heroObs = new IntersectionObserver(entries => {
            threeVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        heroObs.observe(document.getElementById('hero'));

        function animate() {
            requestAnimationFrame(animate);
            if (!threeVisible) return;

            const velFactor = 1 + Math.abs(scrollVelocity) * 0.001;

            ico.rotation.y += 0.003 * velFactor;
            ico.rotation.x += (targetRotX * 0.5 - ico.rotation.x) * 0.02;
            ico.rotation.y += (targetRotY * 0.5 - ico.rotation.y) * 0.015;

            ico2.rotation.y -= 0.004 * velFactor;
            ico2.rotation.x += (targetRotX * 0.3 - ico2.rotation.x) * 0.015;

            points.rotation.y += 0.0005 * velFactor;
            points.rotation.x += 0.0002;
            ring.rotation.z += 0.0015 * velFactor;
            ring2.rotation.z -= 0.001 * velFactor;
            ring2.rotation.x += 0.0005;

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
        for (let i = 0; i < 3; i++) {
            const el = document.getElementById('cur-trail-' + i);
            if (el) trails.push({ el, x: -100, y: -100 });
        }
        // Hide unused trails
        for (let i = 3; i < 5; i++) {
            const el = document.getElementById('cur-trail-' + i);
            if (el) el.style.display = 'none';
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

        document.querySelectorAll('a,button,.btn-mag,.tool-chip,.cert-item,.exp-card,.edu-card,.sp-item,.theme-toggle').forEach(el => {
            el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
        });
    }

    /* ===========================================
       HERO ANIMATION — BIG dramatic reveal
       =========================================== */
    function startHeroAnim() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Tag slides in from left
        tl.to('.hero-tag', { opacity: 1, duration: 0.8 }, 0);
        tl.from('.hero-tag-line', { width: 0, duration: 0.8 }, 0.1);

        // Name slides up dramatically
        tl.to('.hero-line-inner', {
            y: 0, duration: 1.2, stagger: 0.2, ease: 'power4.out',
            onComplete: () => {
                document.querySelectorAll('.hero-line:not(.stroke) .hero-line-inner').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        }, 0.3);

        // Everything else fades up with big offsets
        tl.fromTo('.hero-type-wrap', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9);
        tl.fromTo('.hero-desc', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, 1.1);
        tl.fromTo('.hero-btns', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, 1.3);
        tl.to('.hero-stats-col', { opacity: 1, duration: 0.8 }, 1.4);
        tl.from('.hero-stat', { y: 60, opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)' }, 1.5);
        tl.to('.scroll-hint', { opacity: 1, duration: 0.6 }, 2.0);

        setTimeout(initTypewriter, 1200);
        setTimeout(animCounters, 1600);
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
       CHAR SPLIT ANIMATION — DRAMATIC version
       =========================================== */
    function initCharSplit() {
        const targets = document.querySelectorAll('.contact-big');
        targets.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            el.classList.add('char-split');

            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.classList.add('char');
                if (text[i] === ' ') {
                    span.classList.add('space');
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = text[i];
                }
                el.appendChild(span);
            }

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(el.querySelectorAll('.char'), {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.04,
                        ease: 'back.out(1.5)'
                    });
                },
                once: true
            });
        });
    }

    /* ===========================================
       TEXT SCRAMBLE on Section Titles
       =========================================== */
    function initTextScramble() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';
        gsap.utils.toArray('.sec-title').forEach(el => {
            const original = el.textContent;
            let hasPlayed = false;

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => {
                    if (hasPlayed) return;
                    hasPlayed = true;

                    let iteration = 0;
                    const maxIterations = 15;

                    const interval = setInterval(() => {
                        el.textContent = original.split('').map((char, i) => {
                            if (i < iteration) return original[i];
                            if (char === ' ') return ' ';
                            return chars[Math.floor(Math.random() * chars.length)];
                        }).join('');

                        iteration += 1 / 2;
                        if (iteration >= original.length) {
                            clearInterval(interval);
                            el.textContent = original;
                        }
                    }, 40);
                }
            });
        });
    }

    /* ===========================================
       SCROLL VELOCITY EFFECTS — Marquee skew
       =========================================== */
    function initVelocityEffects() {
        if (isMobile) return;

        const marquees = document.querySelectorAll('.marquee-band');
        let currentSkew = 0;
        let rafId = null;

        function updateSkew() {
            const targetSkew = Math.max(-3, Math.min(3, scrollVelocity * 0.004));
            currentSkew += (targetSkew - currentSkew) * 0.1;

            if (Math.abs(currentSkew) > 0.01) {
                marquees.forEach(m => {
                    m.style.transform = 'skewY(' + currentSkew + 'deg)';
                });
            }

            if (Math.abs(currentSkew) > 0.01 || Math.abs(scrollVelocity) > 1) {
                rafId = requestAnimationFrame(updateSkew);
            } else {
                marquees.forEach(m => { m.style.transform = ''; });
                rafId = null;
            }
        }

        lenis.on('scroll', () => {
            if (!rafId) rafId = requestAnimationFrame(updateSkew);
        });
    }

    /* ===========================================
       SMOOTH PARALLAX — Big movements
       =========================================== */
    function initParallax() {
        if (isMobile) return;

        // Section numbers float
        gsap.utils.toArray('.sec-num').forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el.closest('.sec'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        });

        // Blobs parallax
        gsap.utils.toArray('.blob').forEach((blob, i) => {
            gsap.to(blob, {
                scrollTrigger: {
                    trigger: blob.closest('.sec'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: (i % 2 === 0 ? -100 : 100),
                ease: 'none'
            });
        });

        // Hero content parallax — elements drift up as you scroll
        gsap.to('.hero-left', {
            scrollTrigger: {
                trigger: '.hero-sec',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -200,
            opacity: 0,
            ease: 'none'
        });

        gsap.to('.hero-right', {
            scrollTrigger: {
                trigger: '.hero-sec',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -120,
            opacity: 0,
            ease: 'none'
        });

        gsap.to('#three-canvas', {
            scrollTrigger: {
                trigger: '.hero-sec',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -80,
            ease: 'none'
        });
    }

    /* ===========================================
       SCROLL ANIMATIONS — DRAMATIC reveals
       =========================================== */
    function initScrollAnims() {
        // Section headers — number bounces, title slides, line grows
        gsap.utils.toArray('.sec-head').forEach(h => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: h, start: 'top 85%' }
            });
            tl.from(h.querySelector('.sec-num'), {
                scale: 0, opacity: 0, rotation: -180, duration: 0.8, ease: 'back.out(2)'
            }, 0);
            tl.from(h.querySelector('.sec-title'), {
                x: -80, opacity: 0, duration: 0.8, ease: 'power3.out'
            }, 0.15);
            tl.from(h.querySelector('.sec-line'), {
                scaleX: 0, duration: 1, ease: 'power3.out'
            }, 0.3);
        });

        // Split reveal text — bigger Y offset
        gsap.utils.toArray('.split-reveal').forEach((el, i) => {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: 'power3.out'
            });
        });

        // Code window — slides up with scale
        const codeWinTl = gsap.timeline({
            scrollTrigger: { trigger: '.code-win', start: 'top 80%' }
        });
        codeWinTl.to('.code-win', {
            opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out'
        }, 0);
        codeWinTl.from('.cl', {
            opacity: 0, x: -50, stagger: 0.08, duration: 0.5, ease: 'power2.out'
        }, 0.4);

        // ===== SKILLS HORIZONTAL SCROLL =====
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
                    onUpdate: (self) => {
                        // Only recalc on significant progress changes
                        if (Math.abs(self.progress - (self._lastProg || 0)) < 0.005) return;
                        self._lastProg = self.progress;
                        const rings = track.querySelectorAll('.ring-fill');
                        const vw = window.innerWidth;
                        for (let i = 0; i < rings.length; i++) {
                            const ring = rings[i];
                            const item = ring.closest('.sp-item');
                            const rect = item.getBoundingClientRect();
                            if (rect.left < vw && rect.right > 0) {
                                const pct = parseFloat(ring.dataset.pct) || 0;
                                const c = 326.73;
                                ring.style.strokeDashoffset = c - (c * pct / 100);
                            }
                        }
                    }
                }
            });
        } else {
            gsap.utils.toArray('.ring-fill').forEach(ring => {
                gsap.to(ring, {
                    scrollTrigger: { trigger: ring, start: 'top 90%' },
                    strokeDashoffset: () => {
                        const pct = parseFloat(ring.dataset.pct) || 0;
                        const c = 2 * Math.PI * 52;
                        return c - (c * pct / 100);
                    },
                    duration: 1.5,
                    ease: 'power3.out'
                });
            });
        }

        // Skill items — simple fade up (no scale/rotation to avoid hiding icons)
        gsap.utils.toArray('.skill-panel').forEach(panel => {
            gsap.from(panel.querySelectorAll('.sp-item'), {
                scrollTrigger: { trigger: panel, start: 'top 85%' },
                opacity: 0, y: 30,
                stagger: 0.05, duration: 0.5, ease: 'power3.out'
            });
        });

        // Tool chips — pop in
        let toolsAnimated = false;
        function checkToolsPanel() {
            if (toolsAnimated) return;
            const toolsPanel = document.querySelector('.sp-tools');
            if (!toolsPanel) return;
            const rect = toolsPanel.getBoundingClientRect();
            if (rect.left < window.innerWidth * 0.9 && rect.right > 0) {
                toolsAnimated = true;
                gsap.from('.tool-chip', {
                    opacity: 0, y: 30, scale: 0.5, stagger: 0.08,
                    duration: 0.6, ease: 'back.out(2)'
                });
                gsap.from('.cert-item', {
                    opacity: 0, x: -60, stagger: 0.12,
                    duration: 0.7, ease: 'power3.out', delay: 0.3
                });
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
                opacity: 0, y: 30, scale: 0.5, stagger: 0.08,
                duration: 0.6, ease: 'back.out(2)'
            });
            gsap.from('.cert-item', {
                scrollTrigger: { trigger: '.sp-certs', start: 'top 85%' },
                opacity: 0, x: -60, stagger: 0.12,
                duration: 0.7, ease: 'power3.out'
            });
        }

        // Experience cards — slide in from left with rotation
        gsap.utils.toArray('.exp-card').forEach((card, i) => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: card, start: 'top 85%' }
            });
            tl.to(card, {
                opacity: 1, x: 0, rotation: 0, duration: 1, ease: 'power3.out'
            }, 0);
            tl.from(card.querySelector('.exp-role'), {
                x: -60, opacity: 0, duration: 0.7, ease: 'power3.out'
            }, 0.3);
            tl.from(card.querySelector('.exp-company'), {
                x: -40, opacity: 0, duration: 0.5, ease: 'power3.out'
            }, 0.4);
            tl.from(card.querySelectorAll('.exp-list li'), {
                opacity: 0, x: 50, stagger: 0.08, duration: 0.5, ease: 'power2.out'
            }, 0.5);
            tl.from(card.querySelectorAll('.exp-tags span'), {
                opacity: 0, scale: 0, stagger: 0.05, duration: 0.4, ease: 'back.out(3)'
            }, 0.7);
        });

        // Education cards — flip up with 3D
        gsap.utils.toArray('.edu-card').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: { trigger: card, start: 'top 85%' },
                opacity: 1, y: 0, rotateX: 0, duration: 1, delay: i * 0.2,
                ease: 'power3.out'
            });
        });

        // Terminal — slides up with scale
        const termTl = gsap.timeline({
            scrollTrigger: { trigger: '.term-win', start: 'top 80%' }
        });
        termTl.to('.term-win', {
            opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out'
        }, 0);
        termTl.from('.tl', {
            opacity: 0, x: -40, stagger: 0.1, duration: 0.4, ease: 'power2.out'
        }, 0.5);

        // Contact buttons — big slide up
        gsap.to('.contact-btns', {
            scrollTrigger: { trigger: '.contact-btns', start: 'top 90%' },
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
        });
    }

    /* ===========================================
       MAGNETIC BUTTONS — Stronger pull
       =========================================== */
    function initMagnetic() {
        if (isMobile) return;
        document.querySelectorAll('.btn-mag').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
                const span = btn.querySelector('span');
                if (span) {
                    gsap.to(span, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' });
                }
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
                const span = btn.querySelector('span');
                if (span) {
                    gsap.to(span, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
                }
            });
        });

        // Magnetic on theme toggle
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('mousemove', (e) => {
                const r = toggle.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(toggle, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
            });
            toggle.addEventListener('mouseleave', () => {
                gsap.to(toggle, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            });
        }
    }

    /* ===========================================
       3D CARD TILT — Stronger effect
       =========================================== */
    function initTilt() {
        if (isMobile) return;
        document.querySelectorAll('.exp-card,.edu-card,.hero-stat').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 15, rotateX: -y * 15,
                    transformPerspective: 500, duration: 0.4, ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    /* ===========================================
       SECTION TRANSITIONS (removed for performance)
       =========================================== */
    function initSectionTransitions() {
        // Disabled — scaling large sections caused lag
    }

    /* ===========================================
       MARQUEE SCROLL SPEED (lightweight)
       =========================================== */
    function initMarqueeSpeed() {
        // Removed per-frame ticker — marquee runs at CSS animation speed
    }

    /* ===========================================
       FOOTER REVEAL
       =========================================== */
    function initFooterReveal() {
        const footer = document.querySelector('.footer');
        gsap.from(footer, {
            scrollTrigger: { trigger: footer, start: 'top 95%' },
            opacity: 0, y: 50, duration: 0.8, ease: 'power3.out'
        });
    }

    /* ===========================================
       INIT
       =========================================== */
    function init() {
        gsap.registerPlugin(ScrollTrigger);
        initTheme();
        initPreloader();
        initLenis();
        initThree();
        initCursor();
        initScrollProg();
        initNav();
        initCharSplit();
        initTextScramble();
        initScrollAnims();
        initMagnetic();
        initTilt();
        initParallax();
        initVelocityEffects();
        initSectionTransitions();
        initMarqueeSpeed();
        initFooterReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
