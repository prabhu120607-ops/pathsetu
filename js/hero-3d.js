/**
 * PathSetu 3D Hero Experience
 * Lightweight interactive canvas + CSS 3D perspective tilt.
 * Visualizes the 6-stage journey: Student Input -> AI Profile -> Career Match -> Real Stories -> Skill Gap -> Roadmap.
 * Fully respects prefers-reduced-motion and battery/power constraints.
 */

(function () {
  'use strict';

  function initHero3D() {
    const heroCard = document.getElementById('hero3DCard');
    const heroContainer = document.getElementById('heroVisualContainer');
    const canvas = document.getElementById('hero3DCanvas');

    if (!heroCard || !canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');

    // Resize canvas to match display container
    let width = (canvas.width = canvas.parentElement.clientWidth || 540);
    let height = (canvas.height = canvas.parentElement.clientHeight || 420);

    function resize() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resize, { passive: true });

    // Constellation nodes representing the 6-stage PathSetu methodology
    const stages = [
      { num: '01', label: 'Input', x: 0.16, y: 0.22, color: '#1D4ED8' },
      { num: '02', label: 'AI Profile', x: 0.40, y: 0.18, color: '#2563EB' },
      { num: '03', label: 'Career Fit', x: 0.72, y: 0.26, color: '#3B82F6' },
      { num: '04', label: 'Guidance', x: 0.84, y: 0.60, color: '#1D4ED8' },
      { num: '05', label: 'Skill Gap', x: 0.55, y: 0.78, color: '#2563EB' },
      { num: '06', label: 'Roadmap', x: 0.24, y: 0.74, color: '#15803D' }
    ];

    // Energy pulse particles travelling along the pathway
    let pulses = [
      { from: 0, to: 1, progress: 0.1, speed: 0.007 },
      { from: 1, to: 2, progress: 0.4, speed: 0.006 },
      { from: 2, to: 3, progress: 0.7, speed: 0.008 },
      { from: 3, to: 4, progress: 0.2, speed: 0.007 },
      { from: 4, to: 5, progress: 0.5, speed: 0.006 },
      { from: 5, to: 0, progress: 0.8, speed: 0.005 }
    ];

    let animId = null;
    let isVisible = true;
    let time = 0;

    // Intersection Observer to stop render loop when hero is offscreen
    if ('IntersectionObserver' in window && heroContainer) {
      const observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
          if (isVisible && !prefersReducedMotion && !animId) {
            animId = requestAnimationFrame(render);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(heroContainer);
    }

    function render() {
      if (!isVisible || prefersReducedMotion) return;

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle light blue background aura
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.5, 40, width * 0.5, height * 0.5, width * 0.45);
      grad.addColorStop(0, 'rgba(219, 234, 254, 0.4)');
      grad.addColorStop(0.6, 'rgba(219, 234, 254, 0.1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw connecting bezier pathways
      ctx.lineWidth = 1.5;
      for (let i = 0; i < stages.length; i++) {
        const next = (i + 1) % stages.length;
        const p1 = { x: stages[i].x * width, y: stages[i].y * height };
        const p2 = { x: stages[next].x * width, y: stages[next].y * height };

        // Subtle curved connector
        const cx = (p1.x + p2.x) / 2 + Math.sin(time + i) * 8;
        const cy = (p1.y + p2.y) / 2 + Math.cos(time + i) * 8;

        ctx.strokeStyle = 'rgba(29, 78, 216, 0.18)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
        ctx.stroke();
      }

      // Draw pulses traveling along paths
      pulses.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const p1 = { x: stages[p.from].x * width, y: stages[p.from].y * height };
        const p2 = { x: stages[p.to].x * width, y: stages[p.to].y * height };
        const cx = (p1.x + p2.x) / 2 + Math.sin(time + p.from) * 8;
        const cy = (p1.y + p2.y) / 2 + Math.cos(time + p.from) * 8;

        // Quadratic bezier interpolation
        const t = p.progress;
        const px = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cx + t * t * p2.x;
        const py = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cy + t * t * p2.y;

        // Soft blue pulse particle
        ctx.fillStyle = '#1D4ED8';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      stages.forEach((s, idx) => {
        const nx = s.x * width;
        const ny = s.y * height + Math.sin(time * 1.5 + idx) * 3;

        // Outer white circle with blue border
        ctx.beginPath();
        ctx.arc(nx, ny, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner center
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();

        // Label
        ctx.font = '600 11px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.fillText(s.num + ' ' + s.label, nx, ny + 24);
      });

      animId = requestAnimationFrame(render);
    }

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(render);
    } else {
      // Draw static single frame for reduced motion
      render();
    }

    // 3D Perspective Tilt on Mouse Movement
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;

    function onMouseMove(e) {
      if (prefersReducedMotion || !heroContainer) return;
      const rect = heroContainer.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalize from -1 to +1
      const xNorm = (clientX / rect.width) * 2 - 1;
      const yNorm = (clientY / rect.height) * 2 - 1;

      // Limit max tilt angle to +/- 10 degrees for readability
      targetX = -yNorm * 9;
      targetY = xNorm * 11;
      isHovering = true;
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
      isHovering = false;
    }

    if (heroContainer) {
      heroContainer.addEventListener('mousemove', onMouseMove, { passive: true });
      heroContainer.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }

    // Smooth physics loop for 3D card tilt
    function updateTilt() {
      if (!prefersReducedMotion) {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        if (heroCard) {
          heroCard.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
        }
      }
      requestAnimationFrame(updateTilt);
    }
    requestAnimationFrame(updateTilt);

    // Interactive switch for the preview card inside the hero visual
    const trackButtons = document.querySelectorAll('.hero-track-pill');
    const heroPreviewRole = document.getElementById('heroPreviewRole');
    const heroPreviewMatch = document.getElementById('heroPreviewMatch');
    const heroPreviewDesc = document.getElementById('heroPreviewDesc');
    const heroPreviewSkills = document.getElementById('heroPreviewSkills');

    const previewData = {
      software: {
        role: "Software Developer",
        match: "94% Match",
        desc: "Builds responsive web applications, robust APIs, and interactive products.",
        skills: ["JS / Python", "Data Structures", "Git & REST"]
      },
      design: {
        role: "UI/UX & Product Designer",
        match: "91% Match",
        desc: "Crafts accessible, human-centered interfaces, design systems, and prototypes.",
        skills: ["Figma Systems", "Usability Audit", "Visual Hierarchy"]
      },
      data: {
        role: "Data Analyst & BI",
        match: "88% Match",
        desc: "Transforms complex raw datasets into interactive business dashboards and insights.",
        skills: ["Advanced SQL", "Power BI / Tableau", "Python Pandas"]
      },
      ai: {
        role: "AI & ML Specialist",
        match: "86% Match",
        desc: "Develops applied ML pipelines, RAG retrieval agents, and smart services.",
        skills: ["Linear Algebra", "PyTorch / Scikit", "FastAPI RAG"]
      }
    };

    trackButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        trackButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        const trackId = this.dataset.track;
        const d = previewData[trackId];
        if (d && heroPreviewRole) {
          heroPreviewRole.textContent = d.role;
          heroPreviewMatch.textContent = d.match;
          heroPreviewDesc.textContent = d.desc;
          if (heroPreviewSkills) {
            heroPreviewSkills.innerHTML = d.skills.map((s) => `<span class="pill-badge">${s}</span>`).join('');
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
