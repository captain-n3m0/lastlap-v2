/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RACERS } from '../data/mockData';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const heroRacers = RACERS.slice(0, 3);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);
  const racerStageRef = useRef<HTMLDivElement>(null);
  const bottomControlsRef = useRef<HTMLDivElement>(null);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload hero images
  useEffect(() => {
    heroRacers.forEach((r) => {
      const img = new Image();
      img.src = r.image;
      if (r.bgImage) {
        const bg = new Image();
        bg.src = r.bgImage;
      }
    });
  }, [heroRacers]);

  // GSAP Parallax ScrollTrigger setup
  useEffect(() => {
    if (!heroContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax upward drift on ghost text
      if (ghostTextRef.current) {
        gsap.to(ghostTextRef.current, {
          yPercent: -35,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Parallax scale & drift on racer 3D stage
      if (racerStageRef.current) {
        gsap.to(racerStageRef.current, {
          yPercent: 12,
          scale: 0.95,
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Subtle fade & shift on bottom controls
      if (bottomControlsRef.current) {
        gsap.to(bottomControlsRef.current, {
          yPercent: 20,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
        });
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % heroRacers.length);
      } else {
        setActiveIndex((prev) => (prev + heroRacers.length - 1) % heroRacers.length);
      }

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating, heroRacers.length]
  );

  const goToIndex = useCallback(
    (idx: number) => {
      if (isAnimating || idx === activeIndex) return;
      setIsAnimating(true);
      setActiveIndex(idx);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [activeIndex, isAnimating]
  );

  // Auto-advance gallery index every 4.2 seconds (pauses when hovered/interacting)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      navigate('next');
    }, 4200);

    return () => clearInterval(interval);
  }, [navigate, isHovered]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) navigate('next');
      else navigate('prev');
    }
    touchStartXRef.current = null;
  };

  const getRole = (index: number): 'center' | 'left' | 'right' | 'hidden' => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex - 1 + heroRacers.length) % heroRacers.length) return 'left';
    if (index === (activeIndex + 1) % heroRacers.length) return 'right';
    return 'hidden';
  };

  const getItemStyle = (role: 'center' | 'left' | 'right' | 'hidden'): React.CSSProperties => {
    if (role === 'center') {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.62})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '90%',
        bottom: isMobile ? '20%' : '0px',
        transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms, left 650ms',
        willChange: 'transform, opacity, left',
        cursor: 'default',
      };
    }
    if (role === 'left') {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
        left: isMobile ? '18%' : '28%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '14%',
        transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms, left 650ms',
        willChange: 'transform, opacity, left',
        cursor: 'pointer',
      };
    }
    if (role === 'right') {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
        left: isMobile ? '82%' : '72%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '14%',
        transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms, left 650ms',
        willChange: 'transform, opacity, left',
        cursor: 'pointer',
      };
    }
    return {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transform: 'translateX(-50%) scale(0.7)',
      filter: 'blur(8px)',
      opacity: 0,
      zIndex: 0,
      left: '50%',
      height: '20%',
      bottom: '10%',
      pointerEvents: 'none',
      transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms, left 650ms',
      willChange: 'transform, opacity, left',
    };
  };

  const activeRacer = heroRacers[activeIndex];

  return (
    <section
      ref={heroContainerRef}
      id="hero"
      style={{
        backgroundColor: activeRacer.color,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="relative w-full h-[100vh] min-h-[750px] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image crossfade */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {heroRacers.map((r, idx) =>
          r.bgImage ? (
            <img
              key={`bg-${r.id}`}
              src={r.bgImage}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              style={{
                opacity: activeIndex === idx ? 1 : 0,
                transition: 'opacity 650ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ) : null
        )}
      </div>

      {/* Grain texture overlay */}
      <div
        id="hero-grain"
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Giant Ghost Parallax Text "LAST LAP" */}
      <div
        ref={ghostTextRef}
        id="hero-ghost-text"
        className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[3]"
        style={{
          top: '12%',
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(95px, 28vw, 380px)',
          fontWeight: 900,
          color: 'white',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
        }}
      >
        LAST LAP
      </div>

      {/* Racer Carousel 3D Stage with GSAP Parallax */}
      <div
        ref={racerStageRef}
        id="hero-carousel-stage"
        className="absolute inset-0 z-[4]"
      >
        {heroRacers.map((r, idx) => {
          const role = getRole(idx);
          const style = getItemStyle(role);
          return (
            <div
              key={r.id}
              id={`hero-racer-${r.id}`}
              style={style}
              onClick={() => {
                if (role === 'left') navigate('prev');
                if (role === 'right') navigate('next');
              }}
              aria-label={r.name}
            >
              <img
                src={r.image}
                alt={r.name}
                referrerPolicy="no-referrer"
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Magazine Editorial Controls & Typography */}
      <div
        ref={bottomControlsRef}
        className="absolute bottom-6 sm:bottom-12 left-4 sm:left-12 max-w-[460px] z-30"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/30 text-[11px] font-mono font-bold text-white tracking-[0.2em]">
            DOSSIER {activeRacer.serial}
          </span>
          <span className="text-white/90 text-xs font-mono font-semibold tracking-widest uppercase">
            {activeRacer.name}
          </span>
        </div>

        {/* Main Headline with High-Contrast Magazine Display */}
        <h1
          id="hero-main-headline"
          className="text-white font-black uppercase text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] mb-3 drop-shadow-lg"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
        >
          EVERY RIDER HAS A STORY.
        </h1>

        {/* Supporting Tagline */}
        <p className="text-white/90 text-xs sm:text-sm font-semibold font-mono tracking-widest mb-6 uppercase flex items-center gap-2">
          <span>FIND YOUR ROUTE.</span>
          <span className="text-white/40">/</span>
          <span>OWN YOUR RACER.</span>
        </p>

        {/* Carousel controls */}
        <div 
          className="flex items-center gap-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={() => navigate('prev')}
            disabled={isAnimating}
            aria-label="Previous racer"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 border-white text-white bg-black/40 backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => navigate('next')}
            disabled={isAnimating}
            aria-label="Next racer"
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 border-white text-white bg-black/40 backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <ArrowRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="flex flex-col pl-2 gap-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-mono font-bold text-xs tracking-widest">
                {String(activeIndex + 1).padStart(2, '0')} / {String(heroRacers.length).padStart(2, '0')}
              </span>
              {/* Interactive index step pills */}
              <div className="flex items-center gap-1.5 ml-1">
                {heroRacers.map((_, i) => (
                  <button
                    key={`indicator-${i}`}
                    type="button"
                    onClick={() => goToIndex(i)}
                    aria-label={`Jump to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      activeIndex === i
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-white/50 font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
              <span>GALLERY INDEX</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="absolute bottom-6 sm:bottom-12 right-4 sm:right-12 z-30">
        <a
          href="#journey"
          id="hero-primary-cta"
          className="group flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white text-black font-black uppercase text-sm sm:text-lg tracking-wider rounded shadow-2xl hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all no-underline"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          <span>START THE JOURNEY</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
