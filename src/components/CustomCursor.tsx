/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorState, setCursorState] = useState<{
    hovered: boolean;
    type: 'default' | 'button' | 'card' | 'link' | 'interactive';
    label: string;
  }>({
    hovered: false,
    type: 'default',
    label: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // Check if device is touch-primary or prefers reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [role="button"], .racer-card, [data-cursor], [data-cursor-label]'
      );

      if (interactiveEl) {
        const explicitLabel = interactiveEl.getAttribute('data-cursor-label');
        const customType = (interactiveEl.getAttribute('data-cursor') as any) || 'interactive';

        if (interactiveEl.classList.contains('racer-card') || interactiveEl.closest('#racers')) {
          setCursorState({
            hovered: true,
            type: 'card',
            label: explicitLabel || 'INSPECT',
          });
        } else if (interactiveEl.tagName.toLowerCase() === 'button') {
          setCursorState({
            hovered: true,
            type: 'button',
            label: explicitLabel || '',
          });
        } else if (interactiveEl.tagName.toLowerCase() === 'a') {
          setCursorState({
            hovered: true,
            type: 'link',
            label: explicitLabel || '',
          });
        } else {
          setCursorState({
            hovered: true,
            type: customType,
            label: explicitLabel || '',
          });
        }
      } else {
        setCursorState({
          hovered: false,
          type: 'default',
          label: '',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    // Smooth physics loop
    const render = () => {
      const ease = 0.25;
      curX += (mouseX - curX) * ease;
      curY += (mouseY - curY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Precision Optical Glass Loupe Anchor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${
            cursorState.hovered
              ? cursorState.type === 'card'
                ? 'w-24 h-24 sm:w-28 sm:h-28'
                : 'w-20 h-20'
              : isMouseDown
              ? 'w-12 h-12'
              : 'w-16 h-16'
          }`}
          style={{
            // Clean optical glass refraction, enhanced brightness, and high-clarity contrast
            backdropFilter: cursorState.hovered
              ? 'brightness(1.25) contrast(1.25) saturate(1.3)'
              : 'brightness(1.18) contrast(1.18) saturate(1.2)',
            WebkitBackdropFilter: cursorState.hovered
              ? 'brightness(1.25) contrast(1.25) saturate(1.3)'
              : 'brightness(1.18) contrast(1.18) saturate(1.2)',
          }}
        >
          {/* Convex Lens Curvature Glow & Shading */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
            style={{
              background: cursorState.hovered
                ? 'radial-gradient(circle at 35% 30%, rgba(251, 191, 36, 0.18) 0%, rgba(255, 255, 255, 0.08) 35%, rgba(0, 0, 0, 0.15) 100%)'
                : 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(0, 0, 0, 0.2) 100%)',
              boxShadow: cursorState.hovered
                ? '0 0 24px rgba(251, 191, 36, 0.35), inset 0 0 16px rgba(255, 255, 255, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.8)'
                : '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
            }}
          />

          {/* Precision Glass Bezel Rim */}
          <div
            className={`absolute inset-0 rounded-full border pointer-events-none transition-colors duration-200 ${
              cursorState.hovered
                ? 'border-amber-400/90'
                : isMouseDown
                ? 'border-amber-400'
                : 'border-white/60'
            }`}
          />

          {/* Top Curved Specular Arc Glint */}
          <div className="absolute top-1 left-2 right-2 h-[38%] rounded-[50%] bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none opacity-80" />

          {/* Micro Telemetry Pip (Non-Obtrusive) */}
          <div
            className={`relative z-10 w-1 h-1 rounded-full pointer-events-none transition-all duration-150 ${
              cursorState.hovered
                ? 'bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,1)] scale-125'
                : 'bg-white/80 scale-100 shadow-[0_0_4px_rgba(255,255,255,0.8)]'
            }`}
          />

          {/* Contextual Badge */}
          {cursorState.hovered && cursorState.label && (
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-zinc-950/95 border border-white/20 backdrop-blur-md text-[9px] font-mono font-bold tracking-widest text-white shadow-xl uppercase flex items-center gap-1 z-30">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              <span>{cursorState.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomCursor;
