/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ImageItem {
  src: string;
  bg: string;
  bgImage?: string;
  panel: string;
  label?: string;
}

const IMAGES: ImageItem[] = [
  { 
    src: 'https://cdn.lastlap.live/Adobe%20Express%20-%20file%20(1).png', 
    bg: '#A94E34', 
    bgImage: 'https://cdn.lastlap.live/b72dc863-6a64-46d8-a3a7-ec97a5ff01bc.png',
    panel: '#C46246',
    label: 'Terracotta'
  },
  { 
    src: 'https://cdn.lastlap.live/Adobe%20Express%20-%20file.png', 
    bg: '#52523A', 
    bgImage: 'https://cdn.lastlap.live/274c77ed-3538-4775-846d-f294c56cff3d.png',
    panel: '#6B6A4B',
    label: 'Desert Olive'
  },
  { 
    src: 'https://cdn.lastlap.live/Untitled%20-%20August%2023%2C%202026%20at%2002.55.00.png', 
    bg: '#28485B', 
    bgImage: 'https://cdn.lastlap.live/7739ea5d-36ca-4c20-a2e1-8249aaf96ffb.png',
    panel: '#38617A',
    label: 'Rally Navy'
  },
];

interface HeroCarouselProps {
  onGo404?: () => void;
}

export default function HeroCarousel({ onGo404 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Preload all racer and background images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const racerImg = new Image();
      racerImg.src = img.src;
      if (img.bgImage) {
        const bgImg = new Image();
        bgImg.src = img.bgImage;
      }
    });
  }, []);

  // Window resize handler for isMobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Clear pending timeout on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }
    };
  }, []);

  // Navigation logic
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;

      setIsAnimating(true);
      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % 3);
      } else {
        setActiveIndex((prev) => (prev + 2) % 3);
      }

      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }

      animTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  // Auto-advance gallery index every 4.2 seconds
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      navigate('next');
    }, 4200);

    return () => clearInterval(interval);
  }, [navigate, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    touchStartXRef.current = null;
  };

  // Derive role for an image index
  const getRole = (index: number): 'center' | 'left' | 'right' => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 2) % 3) return 'left';
    return 'right';
  };

  // Compute styling per role
  const getItemStyle = (role: 'center' | 'left' | 'right'): React.CSSProperties => {
    if (role === 'center') {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : '0px',
        transition:
          'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, filter, opacity, left',
        cursor: 'default',
      };
    }

    if (role === 'left') {
      return {
        position: 'absolute',
        aspectRatio: '0.6 / 1',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        transition:
          'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, filter, opacity, left',
        cursor: 'pointer',
      };
    }

    // right
    return {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(2px)',
      opacity: 0.85,
      zIndex: 10,
      left: isMobile ? '80%' : '70%',
      height: isMobile ? '16%' : '28%',
      bottom: isMobile ? '32%' : '12%',
      transition:
        'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform, filter, opacity, left',
      cursor: 'pointer',
    };
  };

  return (
    <div
      id="lastlap-hero-root"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full h-screen overflow-hidden select-none bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div id="lastlap-viewport-container" className="relative w-full h-screen overflow-hidden">
        {/* Background images crossfade layer */}
        <div id="background-images-layer" className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {IMAGES.map((img, idx) =>
            img.bgImage ? (
              <img
                key={`bg-img-${idx}`}
                id={`bg-image-${idx}`}
                src={img.bgImage}
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

        {/* Grain overlay */}
        <div
          id="grain-overlay"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Giant ghost text "LAST LAP" */}
        <div
          id="ghost-heading"
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: 'white',
            opacity: 1,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          LAST LAP
        </div>

        {/* Top brand header & 404 test button */}
        <div
          id="brand-header"
          className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between text-xs font-semibold uppercase text-white tracking-[0.18em]"
          style={{
            zIndex: 60,
            opacity: 0.9,
          }}
        >
          <span>LASTLAP // 2,525 RACERS</span>
          {onGo404 && (
            <button
              type="button"
              onClick={onGo404}
              id="toggle-404-btn"
              className="text-[11px] font-mono tracking-widest px-3 py-1.5 rounded border border-white/40 hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              TEST 404 SCREEN →
            </button>
          )}
        </div>

        {/* Character/Bike Carousel */}
        <div id="carousel-stage" className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((img, idx) => {
            const role = getRole(idx);
            const style = getItemStyle(role);

            return (
              <div
                key={img.src}
                id={`racer-item-${idx}`}
                style={style}
                onClick={() => {
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
                aria-label={`Racer ${idx + 1}`}
              >
                <img
                  id={`racer-img-${idx}`}
                  src={img.src}
                  alt={`LastLap Desert Racer ${idx + 1}`}
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

        {/* Bottom-left text + nav buttons */}
        <div
          id="bottom-left-controls"
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 max-w-[340px]"
          style={{ zIndex: 60 }}
        >
          <p
            id="story-heading"
            className="font-bold uppercase tracking-[0.02em] mb-2 sm:mb-3 text-base sm:text-[22px] text-white"
            style={{ opacity: 0.95 }}
          >
            EVERY RIDER HAS A STORY
          </p>
          <p
            id="story-description"
            className="hidden sm:block text-xs sm:text-sm text-white leading-[1.6] mb-4 sm:mb-5"
            style={{ opacity: 0.85 }}
          >
            Discover 2,525 unique hand-drawn desert racers. Choose your bike, enter the grid, and
            chase the final lap across the ecosystem.
          </p>

          <div id="carousel-nav-buttons" className="flex items-center gap-3 sm:gap-4">
            <button
              id="prev-button"
              type="button"
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous Racer"
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white bg-transparent hover:bg-white/12 hover:scale-[1.08] active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-[26px] h-[26px] stroke-[2.25]" />
            </button>
            <button
              id="next-button"
              type="button"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next Racer"
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white bg-transparent hover:bg-white/12 hover:scale-[1.08] active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              <ArrowRight className="w-[26px] h-[26px] stroke-[2.25]" />
            </button>
          </div>
        </div>

        {/* Bottom-right link "START THE JOURNEY" */}
        <div
          id="journey-link-container"
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            id="start-journey-link"
            href="#journey"
            className="group flex items-center gap-2 text-white uppercase no-underline transition-opacity duration-200"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.95';
            }}
          >
            <span>START THE JOURNEY</span>
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 stroke-[2.25] transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
