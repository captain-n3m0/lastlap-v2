/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  useCallback,
  useState
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  onActiveChange?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    data-cursor="card"
    data-cursor-label="DRAG / INSPECT"
    {...rest}
    className={`racer-card absolute top-1/2 left-1/2 rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl [transform-style:preserve-3d] [will-change:transform] transform-gpu [backface-visibility:hidden] select-none touch-none cursor-grab active:cursor-grabbing transition-shadow duration-300 ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));

Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  scale?: number;
  skewY?: number;
  opacity?: number;
  zIndex: number;
}

// Standard isometric stack position with clustered deep stack
const makeSlot = (i: number, distX: number, distY: number, total: number, skew: number): Slot => {
  const effectiveStep = Math.min(i, 3) + Math.max(0, i - 3) * 0.12;
  const opacity = i > 4 ? 0 : i === 4 ? 0.35 : 1;
  return {
    x: effectiveStep * distX,
    y: -effectiveStep * distY,
    z: -effectiveStep * distX * 1.5,
    scale: Math.max(0.88, 1 - effectiveStep * 0.035),
    skewY: skew,
    opacity,
    zIndex: total - i
  };
};

// Magnetic Separation & Elevator Slotting
const makeMagneticSlot = (
  slotIndex: number,
  distX: number,
  distY: number,
  total: number,
  targetInsertionSlot: number,
  baseSkew: number
): Slot => {
  const effectiveStep = Math.min(slotIndex, 3) + Math.max(0, slotIndex - 3) * 0.12;
  let x = effectiveStep * distX;
  let y = -effectiveStep * distY;
  let z = -effectiveStep * distX * 1.5;

  const separationGap = 55;
  const isAfterSplit = slotIndex >= targetInsertionSlot;

  if (isAfterSplit) {
    x += (distX / Math.max(1, distX)) * separationGap;
    y -= (distY / Math.max(1, distY)) * (separationGap * 0.7);
    z -= separationGap * 1.4;
  }

  const distFromSplit = Math.abs(slotIndex - targetInsertionSlot);
  const proximityScale = distFromSplit === 0 || distFromSplit === 1 ? 1.02 : 0.98;
  const opacity = slotIndex > 4 ? 0 : slotIndex === 4 ? 0.35 : 1;

  return {
    x,
    y,
    z,
    scale: Math.max(0.88, (1 - effectiveStep * 0.035) * proximityScale),
    skewY: baseSkew + (isAfterSplit ? -1 : 1),
    opacity,
    zIndex: total - slotIndex
  };
};

const placeNow = (el: HTMLElement, slot: Slot) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: slot.skewY ?? 0,
    scale: slot.scale ?? 1,
    opacity: slot.opacity ?? 1,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

export interface CardSwapRef {
  swap: () => void;
  swapPrev: () => void;
  resetDeck: () => void;
}

export const CardSwap = forwardRef<CardSwapRef, CardSwapProps>(({
  width = 340,
  height = 460,
  cardDistance = 28,
  verticalDistance = 22,
  delay = 4500,
  pauseOnHover = true,
  onCardClick,
  onActiveChange,
  skewAmount = 5,
  easing = 'elastic',
  children
}, forwardedRef) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'power3.out',
          durDrop: 0.65,
          durMove: 0.65,
          durReturn: 0.65,
          promoteOverlap: 0.7,
          returnDelay: 0.05
        }
      : {
          ease: 'power2.inOut',
          durDrop: 0.6,
          durMove: 0.6,
          durReturn: 0.6,
          promoteOverlap: 0.45,
          returnDelay: 0.15
        },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const order = useRef<number[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const isSwapping = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  // Active hover indicator slot state for rendering docking guide
  const [dockingSlotIndex, setDockingSlotIndex] = useState<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Fast GPU-accelerated trail response without costly CPU blur filter recalculation
  const triggerImageTrail = (
    cardEl: HTMLElement | null,
    options: {
      trailX?: number;
      trailY?: number;
      trailScale?: number;
      trailOpacity?: number;
      duration?: number;
      ease?: string;
    }
  ) => {
    if (!cardEl) return;
    const trail1 = cardEl.querySelector<HTMLElement>('.card-trail-ghost-1');
    const mainImg = cardEl.querySelector<HTMLElement>('.card-main-image');
    const speedLines = cardEl.querySelector<HTMLElement>('.card-speed-streak');

    const {
      trailX = 0,
      trailY = 0,
      trailScale = 1,
      trailOpacity = 0,
      duration = 0.35,
      ease = 'power2.out'
    } = options;

    if (trail1) {
      gsap.to(trail1, {
        x: trailX,
        y: trailY,
        scale: trailScale,
        opacity: trailOpacity,
        duration,
        ease,
        overwrite: 'auto'
      });
    }

    if (mainImg && (trailX !== 0 || trailY !== 0)) {
      gsap.to(mainImg, {
        x: -trailX * 0.2,
        y: -trailY * 0.2,
        duration: duration * 0.8,
        ease,
        overwrite: 'auto'
      });
    }

    if (speedLines) {
      gsap.to(speedLines, {
        opacity: trailOpacity > 0 ? 0.6 : 0,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  // Animate all cards to their current ordered standard slots
  const renderOrder = useCallback((animate = true, duration = 0.6) => {
    const total = order.current.length;
    order.current.forEach((cardIndex, slotIndex) => {
      const el = refs[cardIndex]?.current;
      if (!el) return;
      const slot = makeSlot(slotIndex, cardDistance, verticalDistance, total, skewAmount);
      if (animate) {
        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          xPercent: -50,
          yPercent: -50,
          skewY: slot.skewY,
          scale: slot.scale ?? 1,
          opacity: slot.opacity ?? 1,
          zIndex: slot.zIndex,
          rotationZ: 0,
          duration,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      } else {
        placeNow(el, slot);
      }

      // Reset trailing effects
      triggerImageTrail(el, {
        trailX: 0,
        trailY: 0,
        trailOpacity: 0,
        duration: 0.4
      });
    });

    if (order.current[0] !== undefined) {
      onActiveChangeRef.current?.(order.current[0]);
    }
  }, [cardDistance, verticalDistance, skewAmount, refs]);

  // Advance to next card (front card drops and moves to back)
  const triggerSwap = useCallback((direction: 'next' | 'prev' = 'next') => {
    if (order.current.length < 2 || isSwapping.current || isDragging.current) return;
    
    if (direction === 'prev') {
      // Bring back card to front
      const lastIndex = order.current[order.current.length - 1];
      const elLast = refs[lastIndex]?.current;
      if (!elLast) return;

      isSwapping.current = true;
      const total = refs.length;
      const tl = gsap.timeline({
        onComplete: () => {
          isSwapping.current = false;
          triggerImageTrail(elLast, { trailX: 0, trailY: 0, trailOpacity: 0, duration: 0.4 });
        }
      });
      tlRef.current = tl;

      // Activate trailing motion effect for swinging card
      triggerImageTrail(elLast, {
        trailX: 20,
        trailY: -15,
        trailScale: 1.04,
        trailOpacity: 0.4,
        duration: 0.4
      });

      // Bring last card up and to front
      tl.set(elLast, { zIndex: total + 10 });
      tl.to(elLast, {
        x: -80,
        y: '+=120',
        z: 150,
        scale: 1.05,
        rotationZ: -6,
        duration: 0.4,
        ease: 'power2.out'
      });

      // Shift other cards back with subtle trailing response
      const remaining = order.current.slice(0, -1);
      remaining.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, total, skewAmount);
        
        triggerImageTrail(el, {
          trailX: -6,
          trailY: 4,
          trailOpacity: 0.2,
          duration: 0.3
        });

        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: slot.skewY,
            scale: slot.scale ?? 1,
            opacity: slot.opacity ?? 1,
            zIndex: slot.zIndex,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              triggerImageTrail(el, { trailX: 0, trailY: 0, trailOpacity: 0, duration: 0.2 });
            }
          },
          '0.1'
        );
      });

      const frontSlot = makeSlot(0, cardDistance, verticalDistance, total, skewAmount);
      tl.to(
        elLast,
        {
          x: frontSlot.x,
          y: frontSlot.y,
          z: frontSlot.z,
          skewY: frontSlot.skewY,
          scale: frontSlot.scale ?? 1,
          opacity: frontSlot.opacity ?? 1,
          rotationZ: 0,
          zIndex: total,
          duration: 0.5,
          ease: 'power3.out'
        },
        '-=0.2'
      );

      tl.call(() => {
        order.current = [lastIndex, ...remaining];
        if (order.current[0] !== undefined) {
          onActiveChangeRef.current?.(order.current[0]);
        }
      });

      return;
    }

    // Default 'next' flow
    const [front, ...rest] = order.current;
    const elFront = refs[front]?.current;
    if (!elFront) return;

    isSwapping.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isSwapping.current = false;
        triggerImageTrail(elFront, { trailX: 0, trailY: 0, trailOpacity: 0, duration: 0.3 });
      }
    });
    tlRef.current = tl;

    // Apply upward vertical trailing motion effect to the dropping front card
    triggerImageTrail(elFront, {
      trailX: -8,
      trailY: -25,
      trailScale: 1.03,
      trailOpacity: 0.45,
      duration: config.durDrop * 0.7
    });

    tl.to(elFront, {
      y: '+=450',
      duration: config.durDrop,
      ease: config.ease
    });

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length, skewAmount);

      // Subtle forward velocity trail for promoted cards
      triggerImageTrail(el, {
        trailX: 10,
        trailY: -6,
        trailOpacity: 0.25,
        duration: config.durMove * 0.6
      });

      tl.set(el, { zIndex: slot.zIndex }, 'promote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          skewY: slot.skewY,
          scale: slot.scale ?? 1,
          opacity: slot.opacity ?? 1,
          duration: config.durMove,
          ease: config.ease,
          onComplete: () => {
            triggerImageTrail(el, { trailX: 0, trailY: 0, trailOpacity: 0, duration: 0.4 });
          }
        },
        `promote+=${i * 0.1}`
      );
    });

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length, skewAmount);
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      },
      undefined,
      'return'
    );

    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        skewY: backSlot.skewY,
        scale: backSlot.scale ?? 1,
        opacity: backSlot.opacity ?? 1,
        duration: config.durReturn,
        ease: config.ease
      },
      'return'
    );

    tl.call(() => {
      order.current = [...rest, front];
      if (order.current[0] !== undefined) {
        onActiveChangeRef.current?.(order.current[0]);
      }
    });
  }, [cardDistance, verticalDistance, skewAmount, config, refs]);

  const triggerSwapPrev = useCallback(() => {
    triggerSwap('prev');
  }, [triggerSwap]);

  const resetDeck = useCallback(() => {
    tlRef.current?.kill();
    isSwapping.current = false;
    order.current = Array.from({ length: refs.length }, (_, i) => i);
    setDockingSlotIndex(null);
    renderOrder(true, 0.8);
  }, [refs.length, renderOrder]);

  useImperativeHandle(forwardedRef, () => ({
    swap: () => triggerSwap('next'),
    swapPrev: triggerSwapPrev,
    resetDeck
  }), [triggerSwap, triggerSwapPrev, resetDeck]);

  // Restart auto timer (only if currently visible in viewport)
  const restartTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (delay > 0 && refs.length >= 2 && isVisibleRef.current) {
      intervalRef.current = window.setInterval(() => triggerSwap('next'), delay);
    }
  }, [delay, refs.length, triggerSwap]);

  // Initialize, place cards, and attach viewport observer
  useEffect(() => {
    order.current = Array.from({ length: refs.length }, (_, i) => i);
    onActiveChangeRef.current?.(0);

    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total, skewAmount));
      }
    });

    // Viewport IntersectionObserver to prevent background execution during scroll
    let observer: IntersectionObserver | null = null;
    if (container.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisibleRef.current = entry?.isIntersecting ?? true;
          if (entry?.isIntersecting) {
            restartTimer();
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            tlRef.current?.pause();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(container.current);
    } else {
      restartTimer();
    }

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        if (!isDragging.current) {
          tlRef.current?.pause();
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };
      const resume = () => {
        if (!isDragging.current && isVisibleRef.current) {
          tlRef.current?.play();
          restartTimer();
        }
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        observer?.disconnect();
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    return () => {
      observer?.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs, triggerSwap, restartTimer]);

  // Handle Drag & Touch Swipe Gestures with real-time trailing motion feedback
  const handlePointerDown = (cardIndex: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const el = refs[cardIndex]?.current;
    if (!el || isSwapping.current) return;

    // Pause auto timer
    tlRef.current?.kill();
    if (intervalRef.current) clearInterval(intervalRef.current);

    isDragging.current = true;
    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    const startTime = Date.now();
    let hasMoved = false;

    const total = order.current.length;
    const initialSlotIndex = order.current.indexOf(cardIndex);
    const initialSlot = makeSlot(initialSlotIndex >= 0 ? initialSlotIndex : 0, cardDistance, verticalDistance, total, skewAmount);

    // Initial scale for held card
    gsap.to(el, {
      scale: 0.88,
      skewY: 0,
      zIndex: 9999,
      boxShadow: '0 25px 50px -5px rgba(0,0,0,0.9), 0 0 35px rgba(255,255,255,0.2)',
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    let currentTargetSlot = initialSlotIndex;
    setDockingSlotIndex(currentTargetSlot);

    const animateSplit = (targetSlot: number) => {
      const remainingOrder = order.current.filter((idx) => idx !== cardIndex);
      remainingOrder.forEach((idx, sIndex) => {
        const otherEl = refs[idx]?.current;
        if (!otherEl) return;
        const magSlot = makeMagneticSlot(sIndex, cardDistance, verticalDistance, total, targetSlot, skewAmount);
        gsap.to(otherEl, {
          x: magSlot.x,
          y: magSlot.y,
          z: magSlot.z,
          scale: magSlot.scale,
          skewY: magSlot.skewY,
          zIndex: magSlot.zIndex,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    };

    animateSplit(currentTargetSlot);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startPointerX;
      const deltaY = moveEvent.clientY - startPointerY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist > 6) {
        hasMoved = true;
      }

      const currentX = initialSlot.x + deltaX;
      const currentY = initialSlot.y + deltaY;
      const dragTilt = Math.max(-14, Math.min(14, deltaX * 0.09));

      gsap.set(el, {
        x: currentX,
        y: currentY,
        z: 220,
        xPercent: -50,
        yPercent: -50,
        scale: 0.86,
        rotationZ: dragTilt,
        skewY: 0,
        force3D: true
      });

      // Real-time trailing motion response based on drag vector
      const trailLagX = -deltaX * 0.14;
      const trailLagY = -deltaY * 0.14;
      const trailAlpha = Math.min(0.65, dist / 120);

      triggerImageTrail(el, {
        trailX: trailLagX,
        trailY: trailLagY,
        trailScale: 1.03,
        trailOpacity: trailAlpha,
        duration: 0.15
      });

      // Calculate nearest slot
      let bestSlot = 0;
      let minDistance = Infinity;
      for (let s = 0; s < total; s++) {
        const slotPos = makeSlot(s, cardDistance, verticalDistance, total, skewAmount);
        const d = Math.hypot(currentX - slotPos.x, currentY - slotPos.y);
        if (d < minDistance) {
          minDistance = d;
          bestSlot = s;
        }
      }

      if (bestSlot !== currentTargetSlot) {
        currentTargetSlot = bestSlot;
        setDockingSlotIndex(bestSlot);
        animateSplit(bestSlot);
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      isDragging.current = false;
      setDockingSlotIndex(null);

      const deltaX = upEvent.clientX - startPointerX;
      const deltaY = upEvent.clientY - startPointerY;
      const duration = Date.now() - startTime;
      const velocityX = Math.abs(deltaX) / (duration || 1);
      const velocityY = Math.abs(deltaY) / (duration || 1);

      // Reset rotation & trailing effects
      gsap.set(el, { rotationZ: 0 });

      // 1. Check for Quick Tap
      if (!hasMoved || (Math.hypot(deltaX, deltaY) < 10 && duration < 300)) {
        renderOrder(true, 0.4);
        onCardClick?.(cardIndex);
        restartTimer();
        return;
      }

      // 2. Check for Swipe Gestures (Horizontal or Down flick)
      const isSwipeLeft = deltaX < -50 || (deltaX < -30 && velocityX > 0.35);
      const isSwipeRight = deltaX > 50 || (deltaX > 30 && velocityX > 0.35);
      const isSwipeDown = deltaY > 60 || (deltaY > 35 && velocityY > 0.4);

      if (isSwipeLeft || isSwipeDown) {
        // Swipe to next card
        renderOrder(false);
        triggerSwap('next');
        restartTimer();
        return;
      } else if (isSwipeRight) {
        // Swipe to previous card
        renderOrder(false);
        triggerSwap('prev');
        restartTimer();
        return;
      }

      // 3. Fallback: Drag-and-drop elevator reordering
      const newOrder = order.current.filter((idx) => idx !== cardIndex);
      newOrder.splice(currentTargetSlot, 0, cardIndex);
      order.current = newOrder;

      renderOrder(true, 0.6);
      restartTimer();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: child.key ?? i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
            child.props.onPointerDown?.(e);
            handlePointerDown(i, e);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="relative [perspective:1400px] transform-gpu select-none touch-pan-y"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    >
      {/* 3D Container */}
      <div className="absolute inset-0 [transform-style:preserve-3d] transform-gpu [will-change:transform]">
        {rendered}

        {/* Docking Indicator Guide when dragging */}
        {dockingSlotIndex !== null && (
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none rounded-2xl border-2 border-dashed border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 ease-out transform-gpu [will-change:transform]"
            style={{
              width,
              height,
              transform: `translate3d(calc(-50% + ${dockingSlotIndex * cardDistance}px), calc(-50% + ${-dockingSlotIndex * verticalDistance}px), ${-dockingSlotIndex * cardDistance * 1.5}px) skewY(${skewAmount}deg) scale(0.98)`,
              zIndex: childArr.length - dockingSlotIndex + 1
            }}
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold tracking-wider">
              SLOT 0{dockingSlotIndex + 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

CardSwap.displayName = 'CardSwap';

export default CardSwap;
