/**
 * PathSetu GSAP 3D ScrollTrigger Module
 * Adds cinematic 3D scrolling animations, section perspective triggers,
 * and dimensional parallax transitions.
 * Fully accessible with prefers-reduced-motion checks.
 */

(function () {
  'use strict';

  function initScroll3D() {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded yet, retrying...');
      setTimeout(initScroll3D, 200);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('User prefers reduced motion. Skipping 3D scroll triggers.');
      return;
    }

    // 0. Hero Headline & CTA Staggered Entrance
    if (document.querySelector('.hero-title')) {
      gsap.from('.hero-eyebrow', { duration: 0.8, y: 30, opacity: 0, ease: 'power2.out' });
      gsap.from('.hero-title', { duration: 1.0, y: 40, opacity: 0, delay: 0.15, ease: 'power3.out' });
      gsap.from('.hero-desc', { duration: 1.0, y: 30, opacity: 0, delay: 0.3, ease: 'power3.out' });
      gsap.from('.hero-cta-group', { duration: 0.9, y: 20, opacity: 0, delay: 0.45, ease: 'power2.out' });
      gsap.from('.hero-trust-row', { duration: 0.8, opacity: 0, delay: 0.6, ease: 'power1.out' });
    }

    // 1. Hero 3D Card Scroll Parallax & Mouse Tilt
    const heroCard = document.getElementById('hero3DCard');
    const heroContainer = document.getElementById('heroVisualContainer');
    if (heroCard && heroContainer) {
      gsap.to(heroCard, {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        },
        rotateX: 18,
        rotateY: -15,
        scale: 0.9,
        y: 60,
        opacity: 0.85,
        ease: 'power1.out'
      });

      // Mousemove 3D Dynamic Perspective Tilt
      heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / (rect.height / 2)) * 10;
        const rotY = (x / (rect.width / 2)) * 10;
        heroCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
      });

      heroContainer.addEventListener('mouseleave', () => {
        heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        heroCard.style.transition = 'transform 0.5s ease-out';
      });

      heroContainer.addEventListener('mouseenter', () => {
        heroCard.style.transition = 'none';
      });
    }

    // 2. Pillars 3D Stagger Entry
    const pillarCards = document.querySelectorAll('.pillar-card');
    if (pillarCards.length) {
      gsap.from(pillarCards, {
        scrollTrigger: {
          trigger: '.pillars-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.9,
        y: 50,
        rotateX: -10,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }

    // 3. Methodology 6-Stage 3D Flow Sequence
    const stageCards = document.querySelectorAll('.stage-card');
    if (stageCards.length) {
      gsap.from(stageCards, {
        scrollTrigger: {
          trigger: '.methodology-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 40,
        scale: 0.92,
        opacity: 0,
        stagger: 0.12,
        ease: 'back.out(1.4)'
      });
    }

    // 4. Methodology Diagram 3D Floating Reveal
    const diagramCallout = document.querySelector('.methodology-diagram-callout');
    if (diagramCallout) {
      gsap.from(diagramCallout, {
        scrollTrigger: {
          trigger: diagramCallout,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 1.1,
        y: 60,
        rotateX: 8,
        opacity: 0,
        ease: 'power2.out'
      });
    }

    // 5. Pathway Preview Cards 3D Depth Wave
    const pathwayCards = document.querySelectorAll('.landing-career-card');
    if (pathwayCards.length) {
      gsap.from(pathwayCards, {
        scrollTrigger: {
          trigger: '.pathway-preview-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 45,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }

    // 6. Projects Showcase 3D Stagger
    const projectCards = document.querySelectorAll('.landing-projects-grid .project-card');
    if (projectCards.length) {
      gsap.from(projectCards, {
        scrollTrigger: {
          trigger: '.projects-showcase-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 40,
        rotateX: -8,
        opacity: 0,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // 7. Global Top Scroll Progress Indicator (Primary Blue #1D4ED8)
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll3DProgressBar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: #1D4ED8;
      z-index: 9999;
      pointer-events: none;
      box-shadow: 0 1px 4px rgba(29, 78, 216, 0.35);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / (height || 1)) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScroll3D);
  } else {
    initScroll3D();
  }
})();
