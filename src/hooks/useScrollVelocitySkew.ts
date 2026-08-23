import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVelocitySkewOptions {
  /** Target CSS selector for elements to skew (default: '.velocity-skew, .skew-on-scroll') */
  selector?: string;
  /** Maximum skew angle in degrees (default: 3) */
  maxSkew?: number;
  /** Velocity divisor - higher means subtler effect (default: 350) */
  divisor?: number;
  /** Smoothing duration in seconds for returning to 0 or interpolating (default: 0.4) */
  duration?: number;
}

/**
 * Custom hook that creates a subtle, aerodynamic skew effect based on scroll velocity.
 * Enhances the visceral feel of speed, momentum, and racing physics.
 */
export function useScrollVelocitySkew(options: ScrollVelocitySkewOptions = {}) {
  const {
    selector = '.velocity-skew, .skew-on-scroll',
    maxSkew = 2.8,
    divisor = 380,
    duration = 0.45,
  } = options;

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    // Use gsap.quickTo for ultra-smooth 60/120fps performance on multiple elements
    const skewSetters: Array<(value: number) => void> = [];

    elements.forEach((el) => {
      // Force hardware acceleration and transform-origin
      gsap.set(el, {
        transformOrigin: 'center center',
        force3D: true,
        willChange: 'transform',
      });

      const setter = gsap.quickTo(el, 'skewY', {
        duration,
        ease: 'power3.out',
      });
      skewSetters.push(setter);
    });

    let resetTimer: NodeJS.Timeout | null = null;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        // Calculate clamped skew angle (inverted so downward scrolling tilts backward)
        const rawSkew = velocity / -divisor;
        const clampedSkew = gsap.utils.clamp(-maxSkew, maxSkew, rawSkew);

        skewSetters.forEach((setSkew) => setSkew(clampedSkew));

        // Smoothly settle back to 0 when scroll stops
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          skewSetters.forEach((setSkew) => setSkew(0));
        }, 80);
      },
    });

    return () => {
      if (resetTimer) clearTimeout(resetTimer);
      st.kill();
      // Reset any active transforms
      elements.forEach((el) => {
        gsap.set(el, { skewY: 0, clearProps: 'transform' });
      });
    };
  }, [selector, maxSkew, divisor, duration]);
}
