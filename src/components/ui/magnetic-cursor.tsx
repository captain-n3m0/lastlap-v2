import React, { useRef, useEffect, FC, ReactNode, useState } from 'react';
import gsap from 'gsap';
import { vec2 } from 'vecteur';

type Vec2 = ReturnType<typeof vec2>;

interface MagneticCursorProps {
  children: ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverPadding?: number;
  hoverAttribute?: string;
  cursorSize?: number;
  cursorColor?: string;
  blendMode?: 'difference' | 'exclusion' | 'normal' | 'screen' | 'overlay';
  cursorClassName?: string;
  shape?: 'circle' | 'square' | 'rounded-square';
  disableOnTouch?: boolean;
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
  /** 
   * Boosts background contrast before blending. 
   * Higher values (1.5 - 2.0) fix visibility on low-contrast/dim backgrounds.
   * Default: 1.5 (150%)
   */
  contrastBoost?: number;
}

interface CursorState {
  el: HTMLDivElement | null;
  pos: {
    current: Vec2;
    target: Vec2;
    previous: Vec2;
  };
  hover: { isHovered: boolean };
  isDetaching: boolean;
}

export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.2,
  hoverPadding = 12,
  hoverAttribute = 'data-magnetic',
  cursorSize = 24,
  cursorColor = 'white', // Pure white works best for exclusion/difference
  blendMode = 'exclusion', // Exclusion is safer than difference for text
  cursorClassName = '',
  shape = 'circle',
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5, // 1.5x contrast boost by default
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef<CursorState | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const configRef = useRef({
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
  });

  useEffect(() => {
    configRef.current = {
      magneticFactor,
      speedMultiplier,
      maxScaleX,
      maxScaleY,
      cursorSize,
      lerpAmount,
      hoverPadding,
    };
  }, [magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding]);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return;
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50 });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const detachDuration = prefersReducedMotion ? 0.1 : 0.35;

    if (!cursorStateRef.current) {
      cursorStateRef.current = {
        el: cursorEl,
        pos: {
          current: vec2(-100, -100),
          target: vec2(-100, -100),
          previous: vec2(-100, -100),
        },
        hover: { isHovered: false },
        isDetaching: false,
      };
    }

    const update = () => {
      const state = cursorStateRef.current;
      if (!state) return;

      const { speedMultiplier, maxScaleX, maxScaleY, lerpAmount } = configRef.current;
      const effectiveLerp = prefersReducedMotion ? 1 : lerpAmount;

      state.pos.current.lerp(state.pos.target, effectiveLerp);
      const delta = state.pos.current.clone().sub(state.pos.previous);
      state.pos.previous.copy(state.pos.current);

      const baseScale = state.hover.isHovered ? 1.75 : 1;
      const speed = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * speedMultiplier;

      gsap.set(state.el, {
        x: state.pos.current.x,
        y: state.pos.current.y,
        rotate: state.hover.isHovered ? 0 : Math.atan2(delta.y, delta.x) * (180 / Math.PI),
        scaleX: baseScale * (state.hover.isHovered ? 1 : 1 + Math.min(speed, maxScaleX)),
        scaleY: baseScale * (state.hover.isHovered ? 1 : 1 - Math.min(speed, maxScaleY)),
        overwrite: 'auto',
      });
    };

    const initializePosition = (event: MouseEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;
      const x = event.clientX;
      const y = event.clientY;
      state.pos.current.x = x;
      state.pos.current.y = y;
      state.pos.target.x = x;
      state.pos.target.y = y;
      state.pos.previous.x = x;
      state.pos.previous.y = y;
      gsap.set(cursorEl, { x, y, opacity: 1 });
    };

    const onMouseMove = (event: PointerEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;

      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;

      const isInViewport =
        event.clientX >= 0 &&
        event.clientX <= window.innerWidth &&
        event.clientY >= 0 &&
        event.clientY <= window.innerHeight;

      gsap.to(cursorEl, { opacity: isInViewport ? 1 : 0, duration: 0.2, overwrite: 'auto' });
    };

    const handleMouseLeave = () => gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
    const handleMouseEnter = () => gsap.to(cursorEl, { opacity: 1, duration: 0.3 });
    const handleClick = () => {};

    gsap.ticker.add(update);
    window.addEventListener('pointermove', onMouseMove);
    window.addEventListener('pointermove', initializePosition, { once: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('click', handleClick);

    let cleanupFunctions: (() => void)[] = [];

    const attachMagneticListeners = () => {
      cleanupFunctions.forEach((c) => c());
      cleanupFunctions = [];

      const selector = `[${hoverAttribute}], button, a[href], [role="button"], input[type="button"], input[type="submit"]`;
      const magneticElements = gsap.utils.toArray<HTMLElement>(selector);

      magneticElements.forEach((el) => {
        if (el.getAttribute('data-no-magnetic') === 'true') return;

        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

        const handlePointerEnter = () => {
          const state = cursorStateRef.current;
          if (!state) return;

          state.hover.isHovered = true;
          state.isDetaching = false;
        };

        const handlePointerLeave = () => {
          const state = cursorStateRef.current;
          if (!state) return;

          state.hover.isHovered = false;
          state.isDetaching = true;

          xTo(0);
          yTo(0);
        };

        let rafId: number | null = null;
        const handlePointerMove = (event: PointerEvent) => {
          if (rafId) return;
          rafId = requestAnimationFrame(() => {
            const bounds = el.getBoundingClientRect();
            // Apply magnetic displacement on interactive buttons/links
            if (bounds.width <= 360 && bounds.height <= 140) {
              const { clientX, clientY } = event;
              const { height, width, left, top } = bounds;
              const { magneticFactor } = configRef.current;
              xTo((clientX - (left + width / 2)) * magneticFactor);
              yTo((clientY - (top + height / 2)) * magneticFactor);
            }
            rafId = null;
          });
        };

        const handlePointerOut = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('pointerenter', handlePointerEnter);
        el.addEventListener('pointerleave', handlePointerLeave);
        el.addEventListener('pointermove', handlePointerMove);
        el.addEventListener('pointerout', handlePointerOut);

        cleanupFunctions.push(() => {
          el.removeEventListener('pointerenter', handlePointerEnter);
          el.removeEventListener('pointerleave', handlePointerLeave);
          el.removeEventListener('pointermove', handlePointerMove);
          el.removeEventListener('pointerout', handlePointerOut);
          xTo(0);
          yTo(0);
        });
      });
    };

    attachMagneticListeners();

    // Re-attach with debounce whenever DOM nodes update (e.g. dynamic tabs, modals, accordions)
    let mutationTimer: NodeJS.Timeout | null = null;
    const observer = new MutationObserver(() => {
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationTimer = setTimeout(() => {
        attachMagneticListeners();
      }, 250);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (mutationTimer) clearTimeout(mutationTimer);
      observer.disconnect();
      gsap.ticker.remove(update);
      window.removeEventListener('pointermove', onMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('click', handleClick);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [disableOnTouch, isTouchDevice, hoverPadding, hoverAttribute, cursorColor, shape]);

  if (disableOnTouch && isTouchDevice) return <>{children}</>;

  const styles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    willChange: 'transform, width, height, border-radius',
    backgroundColor: cursorColor,
    mixBlendMode: blendMode as any,
    width: cursorSize,
    height: cursorSize,
    borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px',
    // KEY FIX: Contrast Boost using backdrop-filter
    backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
    WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
  };

  return (
    <>
      <div ref={cursorRef} className={`magnetic-cursor ${cursorClassName}`} style={styles} />
      {children}
    </>
  );
};
