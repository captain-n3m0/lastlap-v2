/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
}

const DUST_COLORS = [
  'rgba(245, 158, 11, ',   // Amber-500
  'rgba(217, 119, 6, ',    // Amber-600
  'rgba(251, 191, 36, ',   // Amber-400
  'rgba(214, 180, 140, ',  // Desert sand
  'rgba(230, 200, 160, ',  // Warm dust mote
  'rgba(255, 245, 230, ',  // Sunlit particle
];

export const DustParticleCanvas: React.FC<{ containerRef: React.RefObject<HTMLElement | null> }> = ({
  containerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = false;
    const particles: DustParticle[] = [];
    const maxParticles = 180;

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollTime = performance.now();

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Resize canvas to match container
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    // Create a new dust particle
    const createParticle = (x: number, y: number, velocityFactor: number, fromScroll = true): DustParticle => {
      const rect = canvas.getBoundingClientRect();
      const posX = x ?? Math.random() * rect.width;
      const posY = y ?? (velocityFactor > 0 ? rect.height + 10 : -10);
      
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const baseSpeed = fromScroll ? Math.abs(velocityFactor) * 0.4 + Math.random() * 2 : Math.random() * 0.8 + 0.2;
      const direction = velocityFactor > 0 ? -1 : 1;

      const baseColor = DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)];
      const maxAlpha = Math.random() * 0.45 + 0.15;
      const maxLife = Math.random() * 80 + 40;

      return {
        x: posX,
        y: posY,
        vx: Math.sin(angle) * baseSpeed + (Math.random() - 0.5) * 1.5,
        vy: (Math.cos(angle) * baseSpeed * 0.6 * direction) - (fromScroll ? 0.5 : 0.1),
        size: Math.random() * 3.5 + 0.8,
        alpha: 0.05,
        maxAlpha,
        life: 0,
        maxLife,
        color: baseColor,
        wobbleSpeed: Math.random() * 0.04 + 0.01,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    };

    // Spawn burst of dust based on scroll speed
    const emitDustTrail = (speed: number) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const count = Math.min(Math.ceil(Math.abs(speed) * 0.35), 8);

      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift();
        }
        // Emit dust along random horizontal points with slight clustering near the bottom or mid-height
        const randomX = Math.random() * rect.width;
        const randomY = speed > 0 
          ? rect.height - Math.random() * (rect.height * 0.4) 
          : Math.random() * (rect.height * 0.4);
        particles.push(createParticle(randomX, randomY, speed, true));
      }
    };

    // Scroll listener for velocity calculation
    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const timeDelta = Math.max(now - lastScrollTime, 16);
      const distDelta = currentScrollY - lastScrollY;
      
      // Calculate smoothed scroll velocity
      scrollVelocity = (distDelta / timeDelta) * 20;

      if (isVisible && Math.abs(scrollVelocity) > 0.5) {
        emitDustTrail(scrollVelocity);
      }

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver to only render when section is visible
    const targetElement = containerRef.current || canvas;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: '100px 0px' }
    );
    intersectionObserver.observe(targetElement);

    // Animation Loop
    let time = 0;
    const render = () => {
      if (isVisible) {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Decay velocity
        scrollVelocity *= 0.92;

        // Ambient idle motes if very few particles
        if (particles.length < 25 && Math.random() < 0.15) {
          particles.push(
            createParticle(
              Math.random() * rect.width,
              Math.random() * rect.height,
              0.2,
              false
            )
          );
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;

          // Natural turbulence & wobble
          p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.6;
          p.y += p.vy;

          // Drag
          p.vx *= 0.985;
          p.vy *= 0.985;

          // Fade in then out
          const progress = p.life / p.maxLife;
          if (progress < 0.2) {
            p.alpha = (progress / 0.2) * p.maxAlpha;
          } else {
            p.alpha = (1 - (progress - 0.2) / 0.8) * p.maxAlpha;
          }

          if (p.life >= p.maxLife || p.alpha <= 0.01) {
            particles.splice(i, 1);
            continue;
          }

          // Render soft dust particle with subtle radial gradient
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.shadowBlur = p.size * 1.5;
          ctx.fill();
          ctx.restore();
        }

        time += 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};
