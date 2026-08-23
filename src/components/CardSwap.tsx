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
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] select-none touch-none cursor-grab active:cursor-grabbing transition-shadow duration-300 ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
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
  // Visible echelon: cards 0, 1, 2, 3 have progressive steps.
  // Beyond index 3, cluster them tightly behind index 3 and fade out deeper cards so it doesn't create an overflowing fan.
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
  resetDeck: () => void;
}

export const CardSwap = forwardRef<CardSwapRef, CardSwapProps>(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 4500,
  pauseOnHover = true,
  onCardClick,
  onActiveChange,
  skewAmount = 6,
  easing = 'elastic',
  children
}, forwardedRef) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1.8,
          durMove: 1.8,
          durReturn: 1.8,
          promoteOverlap: 0.85,
          returnDelay: 0.05
        }
      : {
          ease: 'power2.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
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

  // Active hover indicator slot state for rendering a subtle docking laser guide
  const [dockingSlotIndex, setDockingSlotIndex] = useState<number | null>(null);

  // Animate all cards to their current ordered standard slots
  const renderOrder = useCallback((animate = true, duration = 0.7) => {
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
          duration,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      } else {
        placeNow(el, slot);
      }
    });

    if (order.current[0] !== undefined) {
      onActiveChangeRef.current?.(order.current[0]);
    }
  }, [cardDistance, verticalDistance, skewAmount, refs]);

  const triggerSwap = useCallback(() => {
    if (order.current.length < 2 || isSwapping.current || isDragging.current) return;
    const [front, ...rest] = order.current;
    const elFront = refs[front]?.current;
    if (!elFront) return;

    isSwapping.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isSwapping.current = false;
      }
    });
    tlRef.current = tl;

    tl.to(elFront, {
      y: '+=500',
      duration: config.durDrop,
      ease: config.ease
    });

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length, skewAmount);
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
          ease: config.ease
        },
        `promote+=${i * 0.12}`
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

  const resetDeck = useCallback(() => {
    tlRef.current?.kill();
    isSwapping.current = false;
    order.current = Array.from({ length: refs.length }, (_, i) => i);
    setDockingSlotIndex(null);
    renderOrder(true, 0.8);
  }, [refs.length, renderOrder]);

  useImperativeHandle(forwardedRef, () => ({
    swap: triggerSwap,
    resetDeck
  }), [triggerSwap, resetDeck]);

  // Restart auto timer
  const restartTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (delay > 0 && refs.length >= 2) {
      intervalRef.current = window.setInterval(triggerSwap, delay);
    }
  }, [delay, refs.length, triggerSwap]);

  // Initialize and place cards
  useEffect(() => {
    order.current = Array.from({ length: refs.length }, (_, i) => i);
    onActiveChangeRef.current?.(0);

    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total, skewAmount));
      }
    });

    restartTimer();

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        if (!isDragging.current) {
          tlRef.current?.pause();
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };
      const resume = () => {
        if (!isDragging.current) {
          tlRef.current?.play();
          restartTimer();
        }
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs, triggerSwap, restartTimer]);

  // Handle Dragging: Hold-to-shrink + Magnetic Slot Cleave & Elevator Insertion
  const handlePointerDown = (cardIndex: number, e: React.PointerEvent<HTMLDivElement>) => {
    // Only left click / primary touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const el = refs[cardIndex]?.current;
    if (!el || isSwapping.current) return;

    // Pause timer and animations
    tlRef.current?.kill();
    if (intervalRef.current) clearInterval(intervalRef.current);

    isDragging.current = true;
    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    let hasMoved = false;

    const total = order.current.length;
    const initialSlotIndex = order.current.indexOf(cardIndex);
    const initialSlot = makeSlot(initialSlotIndex >= 0 ? initialSlotIndex : 0, cardDistance, verticalDistance, total, skewAmount);

    // 1. Shrink held card into high-precision holographic mini-card (scale: 0.76, levitating)
    gsap.to(el, {
      scale: 0.76,
      skewY: 0,
      zIndex: 9999,
      boxShadow: '0 25px 50px -5px rgba(0,0,0,0.9), 0 0 35px rgba(255,255,255,0.2)',
      duration: 0.22,
      ease: 'back.out(1.5)',
      overwrite: 'auto'
    });

    let currentTargetSlot = initialSlotIndex;
    setDockingSlotIndex(currentTargetSlot);

    // 2. Animate deck split (cleaving the stack at target insertion point)
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
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    };

    // Open initial magnetic split
    animateSplit(currentTargetSlot);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startPointerX;
      const deltaY = moveEvent.clientY - startPointerY;

      if (Math.hypot(deltaX, deltaY) > 5) {
        hasMoved = true;
      }

      // Track cursor position directly
      const currentX = initialSlot.x + deltaX;
      const currentY = initialSlot.y + deltaY;

      // Slight natural tilt based on horizontal drag velocity/direction
      const dragTilt = Math.max(-12, Math.min(12, deltaX * 0.08));

      gsap.set(el, {
        x: currentX,
        y: currentY,
        z: 220,
        xPercent: -50,
        yPercent: -50,
        scale: 0.76,
        rotationZ: dragTilt,
        skewY: 0,
        force3D: true
      });

      // Calculate nearest insertion slot along the stack axis
      let bestSlot = 0;
      let minDistance = Infinity;
      for (let s = 0; s < total; s++) {
        const slotPos = makeSlot(s, cardDistance, verticalDistance, total, skewAmount);
        const dist = Math.hypot(currentX - slotPos.x, currentY - slotPos.y);
        if (dist < minDistance) {
          minDistance = dist;
          bestSlot = s;
        }
      }

      // If the target slot changed, shift the magnetic cleave gap smoothly
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

      // Reset rotation tilt
      gsap.set(el, { rotationZ: 0 });

      if (!hasMoved) {
        // Quick click without drag: restore deck and trigger click action
        renderOrder(true, 0.4);
        onCardClick?.(cardIndex);
        restartTimer();
        return;
      }

      // Reorder cards into selected target position
      const newOrder = order.current.filter((idx) => idx !== cardIndex);
      newOrder.splice(currentTargetSlot, 0, cardIndex);
      order.current = newOrder;

      // Smoothly snap held card back to full scale (1.0) and seal the deck
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
      className="relative [perspective:1400px] transform-gpu select-none"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    >
      {/* 3D Container */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {rendered}

        {/* Docking Indicator Guide when dragging */}
        {dockingSlotIndex !== null && (
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none rounded-2xl border-2 border-dashed border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 ease-out"
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
