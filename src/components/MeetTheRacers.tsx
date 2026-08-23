/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RACERS } from '../data/mockData';
import { Racer } from '../types';
import { X, Eye, BookOpen, Layers, Fingerprint } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PAGE_STEP = 3.2;
const PAGE_INSET = 8;
const SKEW = '30deg';

interface BookItem {
  racer: Racer;
  pageCount: number;
  cover: string;
}

export default function MeetTheRacers() {
  const [selectedRacer, setSelectedRacer] = useState<Racer | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['ALL', 'LEGENDARY', 'EPIC', 'RARE'];

  const filteredRacers = useMemo(() => {
    return activeCategory === 'ALL'
      ? RACERS
      : RACERS.filter((r) => r.rarity.toUpperCase() === activeCategory.toUpperCase());
  }, [activeCategory]);

  // Transform racers into books with realistic page counts and gradient covers (optimized layer count)
  const baseBooks: BookItem[] = useMemo(() => {
    return filteredRacers.map((racer, idx) => ({
      racer,
      pageCount: 5 + (idx % 2), // 5, 6 pages at 3.2px gives pristine ~18px spine depth with ultra-light DOM
      cover: `linear-gradient(150deg, ${racer.color} 0%, ${racer.panelColor} 100%)`,
    }));
  }, [filteredRacers]);

  // Duplicate for seamless infinite marquee loop
  const allBooks = useMemo(() => {
    return [...baseBooks, ...baseBooks];
  }, [baseBooks]);

  const total = allBooks.length;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Reveal Timeline
      if (headerRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        if (headerLineRef.current) {
          tl.fromTo(
            headerLineRef.current,
            { width: 0, opacity: 0 },
            { width: 48, opacity: 1, duration: 0.6, ease: 'power2.out' }
          );
        }

        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
            '-=0.3'
          );
        }

        if (subtitleRef.current) {
          tl.fromTo(
            subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
          );
        }
      }

      // Smooth fade-in for marquee
      if (marqueeContainerRef.current) {
        gsap.fromTo(
          marqueeContainerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: marqueeContainerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="racers"
      className="py-28 sm:py-40 bg-black relative border-b border-white/10 text-white overflow-hidden select-none"
    >
      <style>{`
        :root {
          --book-overlap: 115px;
          --hover-push: 60px;
          --marquee-tilt: -7deg;
        }

        /* ---- Marquee ---- */
        .marquee-mask {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(var(--marquee-tilt, -7deg));
          width: 140vw;
          height: calc(286px + 40vw);
          overflow: visible;
          z-index: 10;
          will-change: transform;
        }

        .marquee-fade {
          position: absolute;
          inset: 0;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          will-change: transform;
        }

        .marquee-track {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          width: max-content;
          padding: 60px 0;
          animation: marquee-scroll 60s linear infinite;
          will-change: transform;
        }

        .marquee-mask:has(.book-wrap:hover) .marquee-track,
        .marquee-mask:has(.book:hover) .marquee-track,
        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          from { transform: translate(0, -50%); }
          to { transform: translate(-50%, -50%); }
        }

        /* ---- Book wrapper ---- */
        .book-wrap {
          position: relative;
          width: 200px;
          height: 286px;
          flex-shrink: 0;
          margin-right: calc(-1 * var(--book-overlap));
          transition:
            margin 500ms cubic-bezier(0.2, 0.7, 0.2, 1),
            transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1);
          transform-style: preserve-3d;
          will-change: transform, margin;
        }
        .book-wrap:last-child { margin-right: 0; }

        /* Generous invisible hit-zone to increase hover trigger area */
        .book-wrap::before {
          content: "";
          position: absolute;
          inset: -40px -25px -30px -25px;
          z-index: 50;
          pointer-events: auto;
        }

        .book-wrap:has(+ .book-wrap:hover),
        .book-wrap:has(+ .book-wrap .book:hover) {
          margin-right: calc(-1 * var(--book-overlap) + var(--hover-push));
        }
        .book-wrap:hover,
        .book-wrap:has(.book:hover) {
          margin-left: var(--hover-push);
          z-index: 9999 !important;
        }

        /* ---- Book ---- */
        .book {
          position: relative;
          height: 286px;
          cursor: pointer;
          transform: rotate(7deg);
          transition: transform 450ms cubic-bezier(0.2, 0.7, 0.2, 1);
          will-change: transform;
          transform-style: preserve-3d;
        }
        .book-wrap:hover .book,
        .book:hover {
          transform: rotate(7deg) translateY(-28px) scale(1.06);
          z-index: 100;
        }

        .book-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 200px;
          height: 286px;
          border-radius: 2px;
          transform-origin: 0 0;
          backface-visibility: hidden;
          will-change: transform;
        }

        .book-back-cover {
          box-shadow:
            inset 0 0 0 1px rgba(0, 0, 0, 0.6),
            inset 2px 0 6px rgba(0, 0, 0, 0.5),
            inset -2px 0 6px rgba(0, 0, 0, 0.5);
          z-index: 1;
          filter: brightness(0.7);
        }

        .book-page {
          background: linear-gradient(90deg,
            #8a7649 0%, #c9b88a 6%, #f3e7c9 22%, #fbf3dc 50%,
            #f3e7c9 78%, #c9b88a 94%, #8a7649 100%);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(120, 90, 40, 0.25);
          pointer-events: none;
        }

        .book-front-cover {
          z-index: 1000;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px rgba(255, 255, 255, 0.06),
            inset 8px 0 18px -8px rgba(0, 0, 0, 0.5),
            inset -3px 0 8px -4px rgba(255, 255, 255, 0.08),
            8px 16px 30px rgba(0, 0, 0, 0.6);
        }
        .book-front-cover::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(90deg,
            rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0) 6%,
            rgba(0, 0, 0, 0) 94%, rgba(255, 255, 255, 0.10) 100%);
          border-radius: inherit;
        }

        .book-hinge {
          position: absolute;
          top: 0;
          left: 0;
          height: 5px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 -1px 0 rgba(0, 0, 0, 0.6),
            0 1px 2px rgba(0, 0, 0, 0.4);
          border-radius: 1px;
          z-index: 0;
          filter: brightness(0.6);
        }

        /* ---- Responsive ---- */
        @media (max-width: 768px) {
          :root {
            --book-overlap: 90px;
            --hover-push: 30px;
          }
          .marquee-mask { height: calc(200px + 30vw); }
          .book-wrap { width: 140px; height: 200px; }
          .book { height: 200px; }
          .book-layer { width: 140px; height: 200px; }
        }

        @media (max-width: 480px) {
          :root {
            --book-overlap: 70px;
            --hover-push: 20px;
          }
          .book-wrap { width: 110px; height: 157px; }
          .book { height: 157px; }
          .book-layer { width: 110px; height: 157px; }
        }

        @media (max-width: 360px) {
          .book-wrap { width: 90px; height: 128px; }
          .book { height: 128px; }
          .book-layer { width: 90px; height: 128px; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Editorial Section Masthead */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                ROADBOOK CHAPTER 02 // 3D PASSPORT MARQUEE
              </span>
              <div ref={headerLineRef} className="h-[1px] w-12 bg-white/20 origin-left"></div>
              <span className="text-[11px] font-mono text-emerald-400 tracking-widest uppercase">
                2,525 VALIDATED PROFILES
              </span>
            </div>

            <h2
              ref={titleRef}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.9]"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              MEET THE
              <br />
              <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                RACERS.
              </span>
            </h2>
          </div>

          <div ref={subtitleRef} className="max-w-md">
            <p className="text-base sm:text-lg font-mono text-white/90 uppercase tracking-wide leading-relaxed">
              “Unique souls. Different stories. One road ahead.”
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-white/40 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                GENESIS PASSPORT ARCHIVE
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-white/60">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                HOVER TO INSPECT & EXPAND
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center justify-between gap-4 mb-12 pb-4 border-b border-white/10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40 mr-2 shrink-0 uppercase tracking-widest flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5" />
              REGISTRY TIER:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shrink-0 border ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white shadow-lg scale-105'
                    : 'bg-zinc-950 text-white/60 border-white/10 hover:border-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-white/40 uppercase tracking-wider">
            <span>3D SKEWED BOOK MARQUEE</span>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH STABLE 3D BOOK MARQUEE CONTAINER */}
      <div
        ref={marqueeContainerRef}
        className="relative w-full h-[520px] sm:h-[600px] lg:h-[660px] overflow-hidden my-4"
      >
        <div
          className="marquee-mask"
          style={{ '--marquee-tilt': '-7deg' } as React.CSSProperties}
        >
          <div className="marquee-fade">
            <div className="marquee-track">
              {allBooks.map((item, i) => {
                const { racer, pageCount, cover } = item;
                const depth = PAGE_STEP * (pageCount + 1);

                return (
                  <div
                    key={`${racer.id}-${i}`}
                    className="book-wrap"
                    style={{ zIndex: total - i }}
                    onClick={() => setSelectedRacer(racer)}
                  >
                    <div
                      className="book group"
                      style={{ width: `${200 + depth + 1.1}px` }}
                    >
                      {/* Hinge */}
                      <div
                        className="book-hinge"
                        style={{
                          width: `${depth + 1}px`,
                          background: cover,
                        }}
                      />

                      {/* Back cover */}
                      <div
                        className="book-layer book-back-cover"
                        style={{
                          background: cover,
                          transform: `translateX(${depth}px) skewY(${SKEW})`,
                        }}
                      />

                      {/* Pages */}
                      {Array.from({ length: pageCount }).map((_, pIdx) => {
                        const pageNum = pIdx + 1;
                        const t = pageNum / pageCount;

                        return (
                          <div
                            key={pIdx}
                            className="book-layer book-page"
                            style={{
                              transform: `translateX(${PAGE_STEP * pageNum}px) skewY(${SKEW})`,
                              zIndex: 2 + (pageCount - pageNum),
                              filter: `brightness(${(1 - t * 0.06).toFixed(3)})`,
                              top: `${PAGE_INSET / 2}px`,
                              height: `calc(100% - ${PAGE_INSET}px)`,
                            }}
                          />
                        );
                      })}

                      {/* Front cover */}
                      <div
                        className="book-layer book-front-cover flex flex-col justify-between overflow-hidden"
                        style={{
                          background: cover,
                          transform: `skewY(${SKEW})`,
                        }}
                      >
                        {/* Header Passport Strip */}
                        <div
                          className="p-3 sm:p-3.5 flex items-center justify-between border-b border-white/20 relative z-20"
                          style={{ backgroundColor: racer.panelColor }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-white tracking-[0.12em] uppercase truncate max-w-[100px]">
                              {racer.serial}
                            </span>
                          </div>
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white uppercase tracking-wider border border-white/20">
                            {racer.rarity}
                          </span>
                        </div>

                        {/* Character Visual Area */}
                        <div className="relative flex-grow w-full flex items-end justify-center overflow-hidden p-2">
                          {racer.bgImage && (
                            <img
                              src={racer.bgImage}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                            />
                          )}
                          <img
                            src={racer.image}
                            alt={racer.name}
                            className="relative z-10 max-h-[85%] object-contain object-bottom group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                          />

                          {/* Watermark Serial */}
                          <span className="absolute top-1 right-2 font-mono font-black text-3xl text-white/10 select-none pointer-events-none">
                            {racer.serial}
                          </span>

                          {/* Speed Gauge Badge */}
                          <div className="absolute bottom-2 left-2 z-20 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/20 text-[8px] font-mono text-white font-bold uppercase">
                            {racer.stats.speed} MPH
                          </div>
                        </div>

                        {/* Bottom Info Plate */}
                        <div className="p-3 sm:p-3.5 bg-zinc-950/95 border-t border-white/20 relative z-20">
                          <div className="flex items-baseline justify-between mb-1">
                            <h4
                              className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[130px]"
                              style={{ fontFamily: "'Anton', sans-serif" }}
                            >
                              {racer.name}
                            </h4>
                            <span className="text-[8px] font-mono text-white/50">{racer.serial}</span>
                          </div>

                          {/* Trait Tags */}
                          <div className="flex flex-wrap gap-1 my-1 max-h-4 overflow-hidden">
                            {racer.traits.slice(0, 2).map((trait, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-1.5 py-0.2 rounded bg-white/10 text-[7.5px] font-mono text-white/80 whitespace-nowrap"
                              >
                                {trait}
                              </span>
                            ))}
                          </div>

                          {/* Open Dossier Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRacer(racer);
                            }}
                            className="w-full mt-2 py-1.5 rounded bg-white text-black font-mono font-bold text-[8.5px] sm:text-[9px] tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                          >
                            <Eye className="w-2.5 h-2.5" />
                            <span>INSPECT DOSSIER</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>


      {/* Modal Profile Viewer */}
      {selectedRacer && (
        <div
          id="racer-profile-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedRacer(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-white/20 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-6 flex items-center justify-between border-b border-white/10 text-white"
              style={{ backgroundColor: selectedRacer.panelColor }}
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-80 block">
                    ROBINHOOD SECTOR ARCHIVE // RACER PASSPORT
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {selectedRacer.name} // {selectedRacer.serial}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRacer(null)}
                className="w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Visual Showcase */}
              <div
                className="h-64 sm:h-72 w-full rounded-2xl flex items-end justify-center relative overflow-hidden border border-white/10"
                style={{ backgroundColor: selectedRacer.color }}
              >
                {selectedRacer.bgImage && (
                  <img
                    src={selectedRacer.bgImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                )}
                <img
                  src={selectedRacer.image}
                  alt={selectedRacer.name}
                  className="relative z-10 h-full object-contain object-bottom"
                />

                <div className="absolute top-4 right-4 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white uppercase">
                  RARITY: {selectedRacer.rarity}
                </div>
              </div>

              {/* Bio & Backstory */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/50 block mb-1">
                  OFFICIAL BACKSTORY
                </span>
                <p className="text-sm font-mono text-white/80 leading-relaxed">
                  {selectedRacer.bio}
                </p>
              </div>

              {/* Telemetry Stats Grid */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/50 block mb-3">
                  CIRCUIT TELEMETRY
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">TOP SPEED</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.speed} MPH
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">ACCELERATION</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.acceleration}/100
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">GRIT</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.grit}/100
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">HANDLING</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.handling}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Traits Badges */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/50 block mb-2">
                  MODULAR RIG TRAITS
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRacer.traits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs font-mono text-white font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-white/50">
                  PROOF OF SPEED // GENESIS ONCHAIN MINT
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRacer(null)}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-zinc-200 cursor-pointer"
                >
                  CLOSE DOSSIER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
