/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    let animationFrameId: number;
    let hasMoved = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
      }
      setIsVisible(true);
    };

    const onTouchStart = () => {
      setIsVisible(false);
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
        const customType = interactiveEl.getAttribute('data-cursor') as any;

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
            type: customType || 'interactive',
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
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    // Smooth Spring / Lerp Render Loop
    const render = () => {
      // Direct dot tracking
      dotX += (mouseX - dotX) * 0.75;
      dotY += (mouseY - dotY) * 0.75;

      // Smoothed halo ring lag
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // If invisible or on mobile, do not render
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Central Precision Apex Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-200 ${
            cursorState.hovered
              ? cursorState.type === 'card'
                ? 'bg-amber-400 scale-150 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                : 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.8)]'
              : isMouseDown
              ? 'bg-amber-400 scale-75'
              : 'bg-white/90 scale-100'
          }`}
        />
      </div>

      {/* Outer Tactical Racing Reticle / Speedometer Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`-ml-5 -mt-5 flex items-center justify-center transition-all duration-300 ${
            cursorState.hovered
              ? cursorState.type === 'card'
                ? 'w-16 h-16 -ml-8 -mt-8 rounded-full border border-amber-400/80 bg-amber-500/10 backdrop-blur-[1px] rotate-45 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'w-12 h-12 -ml-6 -mt-6 rounded-full border border-white/60 bg-white/5 backdrop-blur-[1px]'
              : isMouseDown
              ? 'w-8 h-8 -ml-4 -mt-4 rounded-full border border-amber-400/60 bg-amber-400/10'
              : 'w-10 h-10 rounded-full border border-white/25 bg-transparent'
          }`}
        >
          {/* Subtle crosshair notches for racing telemetry feel */}
          {cursorState.hovered && (
            <>
              {/* Corner crosshairs */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0.5 h-1.5 bg-amber-400/80" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-0.5 h-1.5 bg-amber-400/80" />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1.5 h-0.5 bg-amber-400/80" />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-1.5 h-0.5 bg-amber-400/80" />

              {/* Context Tag for Racer Cards or Lookbook elements */}
              {cursorState.label && (
                <span
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 bg-zinc-950/90 border border-amber-400/50 rounded text-[9px] font-mono font-bold tracking-widest text-amber-300 shadow-md uppercase"
                  style={{ transform: cursorState.type === 'card' ? 'rotate(-45deg)' : 'none' }}
                >
                  {cursorState.label}
                </span>
              )}
            </>
          )}

          {/* Idle micro reticle marks */}
          {!cursorState.hovered && (
            <div className="w-full h-full relative opacity-40">
              <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-[1px] bg-white" />
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-[1px] bg-white" />
              <span className="absolute left-0.5 top-1/2 -translate-y-1/2 w-[1px] h-1 bg-white" />
              <span className="absolute right-0.5 top-1/2 -translate-y-1/2 w-[1px] h-1 bg-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CustomCursor;
