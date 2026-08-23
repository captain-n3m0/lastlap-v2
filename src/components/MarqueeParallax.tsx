/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MarqueeParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !row1Ref.current || !row2Ref.current) return;

    const ctx = gsap.context(() => {
      // 1. Dual-direction horizontal parallax scroll motion
      gsap.to(row1Ref.current, {
        xPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(row2Ref.current, {
        xPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // 2. Previous Velocity Skew physics (applied ONLY to this top-page marquee)
      const rows = [row1Ref.current, row2Ref.current];

      rows.forEach((el) => {
        if (!el) return;
        gsap.set(el, {
          transformOrigin: 'center center',
          force3D: true,
          willChange: 'transform',
        });
      });

      const skewSetter1 = gsap.quickTo(row1Ref.current, 'skewY', {
        duration: 0.4,
        ease: 'power3.out',
      });
      const skewSetter2 = gsap.quickTo(row2Ref.current, 'skewY', {
        duration: 0.4,
        ease: 'power3.out',
      });

      let resetTimer: NodeJS.Timeout | null = null;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom+=100',
        end: 'bottom top-=100',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const rawSkew = velocity / -320;
          const clampedSkew = gsap.utils.clamp(-3.5, 3.5, rawSkew);

          skewSetter1(clampedSkew);
          skewSetter2(clampedSkew);

          if (resetTimer) clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            skewSetter1(0);
            skewSetter2(0);
          }, 60);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const marqueeText1 = [
    '2,525 UNIQUE RACERS',
    '//',
    'HIGH OCTANE ONCHAIN',
    '//',
    'SPEED & DUST',
    '//',
    'ROBINHOOD ECOSYSTEM',
    '//',
    'NO SPEED LIMITS',
    '//',
    '2,525 UNIQUE RACERS',
    '//',
    'HIGH OCTANE ONCHAIN',
  ];

  const marqueeText2 = [
    'DESERT FRONTIER',
    '—',
    'THE FINAL LAP',
    '—',
    'UNREAL ENGINE TELEMETRY',
    '—',
    'PROVABLY FAIR RACING',
    '—',
    '$LAP TOKEN REWARDS',
    '—',
    'DESERT FRONTIER',
    '—',
  ];

  return (
    <div
      ref={containerRef}
      id="magazine-marquee-section"
      className="relative py-14 sm:py-20 bg-black overflow-hidden border-y border-white/10 select-none"
    >
      {/* Editorial Watermark Stamp */}
      <div className="absolute top-3 left-6 z-10 flex items-center gap-3 pointer-events-none opacity-40">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white">
          [ AUTONOMOUS SECTOR SCAN // 2525.01 ]
        </span>
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
      </div>

      {/* Row 1 - Forward Parallax */}
      <div
        ref={row1Ref}
        className="velocity-skew flex whitespace-nowrap gap-6 sm:gap-10 -translate-x-12 will-change-transform mb-3 sm:mb-6"
      >
        {[...marqueeText1, ...marqueeText1].map((text, i) => (
          <span
            key={`m1-${i}`}
            className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-wider text-white/90 flex items-center gap-6"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.08em' }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* Row 2 - Reverse Parallax with Outline Styling */}
      <div
        ref={row2Ref}
        className="velocity-skew flex whitespace-nowrap gap-6 sm:gap-10 translate-x-4 will-change-transform"
      >
        {[...marqueeText2, ...marqueeText2].map((text, i) => (
          <span
            key={`m2-${i}`}
            className="text-3xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-wider text-stroke-white text-transparent hover:text-white transition-colors duration-300 flex items-center gap-6"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em' }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
