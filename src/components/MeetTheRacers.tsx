/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RACERS } from '../data/mockData';
import { Racer } from '../types';
import { X, Eye, ChevronLeft, ChevronRight, RotateCw, Gauge, Zap, Shield, Compass, Hand, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CardSwap, Card, CardSwapRef } from './CardSwap';
import { OpenSeaLogo } from './OpenSeaLogo';
import { RacerCardVisual } from './RacerCardVisual';

gsap.registerPlugin(ScrollTrigger);

function DossierModalVisual({ racer }: { racer: Racer }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <div
      className="h-52 sm:h-72 w-full rounded-2xl flex items-end justify-center relative overflow-hidden border border-white/10"
      style={{ backgroundColor: racer.color }}
    >
      {racer.bgImage && (
        <img
          src={racer.bgImage}
          alt=""
          onLoad={() => setBgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            bgLoaded ? 'opacity-50' : 'opacity-0'
          }`}
        />
      )}

      {/* Skeletal Telemetry Loading State */}
      <div
        className={`absolute inset-0 z-15 flex flex-col items-center justify-center p-4 transition-opacity duration-500 bg-zinc-950/70 backdrop-blur-xs ${
          imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden={imageLoaded}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px] opacity-70 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full animate-telemetry-shimmer" />
        </div>
        <div className="relative flex flex-col items-center gap-2 z-10">
          <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-white/80 uppercase">
            DOWNLOADING DOSSIER RIG // {racer.serial}
          </span>
        </div>
      </div>

      <img
        src={racer.image}
        alt={racer.serial}
        onLoad={() => setImageLoaded(true)}
        className={`relative z-10 h-full object-contain object-bottom transition-all duration-500 ${
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
}

export default function MeetTheRacers() {
  const [selectedRacer, setSelectedRacer] = useState<Racer | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [racersList, setRacersList] = useState<Racer[]>([]);
  const [isLoadingRacers, setIsLoadingRacers] = useState(true);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const cardSwapRef = useRef<CardSwapRef>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Fetch NFTs from OpenSea proxy route
  useEffect(() => {
    let mounted = true;
    const fetchNFTs = async () => {
      try {
        const response = await fetch('/api/opensea/nfts');
        if (!response.ok) throw new Error('Failed to fetch NFTs');
        const data = await response.json();
        if (data && data.nfts && data.nfts.length > 0 && mounted) {
          const fallbackImages = [
            'https://cdn.lastlap.live/lastlap/Br4ted.png',
            'https://cdn.lastlap.live/lastlap/H0ld.png',
            'https://cdn.lastlap.live/lastlap/Honorary_for_Oguz.png',
            'https://cdn.lastlap.live/lastlap/Post_for_17th_August.png',
            'https://cdn.lastlap.live/lastlap/Web_Post.png'
          ];
          const mappedRacers: Racer[] = data.nfts.map((nft: any, index: number) => {
            const getTrait = (type: string) => nft.traits?.find((t: any) => t.trait_type === type)?.value;
            return {
              id: nft.identifier,
              name: nft.name || `Racer #${nft.identifier}`,
              serial: String(nft.identifier).padStart(4, '0'),
              image: nft.image_url || nft.display_image_url || fallbackImages[index % fallbackImages.length],
              bgImage: '',
              color: ['#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'][index % 5],
              panelColor: 'bg-zinc-950',
              traits: nft.traits?.map((t: any) => `${t.trait_type}: ${t.value}`) || [],
              bio: nft.description || 'Genesis Racer on the Robinhood Network.',
              stats: {
                speed: getTrait('Speed') ? parseInt(getTrait('Speed'), 10) : Math.floor(Math.random() * 30) + 70,
                acceleration: getTrait('Acceleration') ? parseInt(getTrait('Acceleration'), 10) : Math.floor(Math.random() * 30) + 70,
                grit: getTrait('Grit') ? parseInt(getTrait('Grit'), 10) : Math.floor(Math.random() * 30) + 70,
                handling: getTrait('Handling') ? parseInt(getTrait('Handling'), 10) : Math.floor(Math.random() * 30) + 70,
              },
              rarity: getTrait('Rarity') || 'Rare',
              archetype: getTrait('Archetype') || 'Unknown',
              bike: getTrait('Bike') || 'Genesis'
            };
          });
          setRacersList(mappedRacers);
        }
      } catch (err) {
        console.warn('Could not fetch from OpenSea:', err);
        if (mounted) {
          setRacersList(RACERS);
        }
      } finally {
        if (mounted) setIsLoadingRacers(false);
      }
    };
    fetchNFTs();
    return () => { mounted = false; };
  }, []);

  // Track window resizing for responsive 3D card deck scaling
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleActiveChange = useCallback((idx: number) => {
    setActiveCardIndex(idx);
  }, []);

  const activeRacer = racersList[activeCardIndex] || racersList[0];

  // Dynamically calculate proportional 3D dimensions based on viewport
  const cardDimensions = React.useMemo(() => {
    if (viewportWidth < 400) {
      const w = Math.max(260, viewportWidth - 60);
      return {
        width: w,
        height: Math.round(w * 1.35),
        cardDistance: 14,
        verticalDistance: 12,
        skewAmount: 2.5
      };
    } else if (viewportWidth < 640) {
      const w = Math.min(300, viewportWidth - 64);
      return {
        width: w,
        height: Math.round(w * 1.35),
        cardDistance: 18,
        verticalDistance: 15,
        skewAmount: 3.5
      };
    } else if (viewportWidth < 1024) {
      return {
        width: 320,
        height: 430,
        cardDistance: 24,
        verticalDistance: 18,
        skewAmount: 4
      };
    } else {
      return {
        width: 340,
        height: 460,
        cardDistance: 28,
        verticalDistance: 22,
        skewAmount: 5
      };
    }
  }, [viewportWidth]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (showcaseRef.current) {
        gsap.fromTo(
          showcaseRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: showcaseRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="racers"
      className="py-24 sm:py-36 bg-[#070707] relative border-b border-white/10 text-white overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent blur-[140px] pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-emerald-400 uppercase">
                CHAPTER 02 // ROSTER ARCHIVE
              </span>
            </div>
            <h2
              className="text-4xl sm:text-6xl font-black uppercase text-white tracking-wide leading-none"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
            >
              MEET THE RACERS
            </h2>
            <p className="text-white/60 font-mono text-xs sm:text-sm md:text-base max-w-xl mt-3">
              Perspective dossier showcase. Swipe, flick, or drag through 2,525 provably fair pilots, custom cyber rigs, and high-velocity telemetry.
            </p>
          </div>

          {/* Header Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://opensea.io/collection/lastlaprh"
              target="_blank"
              rel="noreferrer"
              id="racers-opensea-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-cyan-400/30 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-950/40 hover:border-cyan-400 hover:text-white transition-all shadow-md no-underline"
            >
              <OpenSeaLogo className="w-3.5 h-3.5" />
              <span>OPENSEA COLLECTION</span>
            </a>

            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
              <Hand className="w-3.5 h-3.5 text-amber-400" />
              <span>SWIPE OR DRAG TO REORDER</span>
            </div>
          </div>
        </div>

        {/* Showcase Grid: Left Dossier Stats + Center CardSwap Deck */}
        <div ref={showcaseRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center transform-gpu [will-change:transform]">
          {!activeRacer ? (
            <div className="lg:col-span-12 py-32 flex flex-col items-center justify-center space-y-4 text-center">
               <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isLoadingRacers ? 'bg-cyan-400 animate-ping' : 'bg-red-500'}`} />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-white/80 uppercase">
                  {isLoadingRacers ? 'FETCHING LIVE ROSTER FROM OPENSEA // PLEASE STAND BY' : 'CONNECTION FAILED // PLEASE CONFIGURE OPENSEA_API_KEY'}
                </span>
            </div>
          ) : (
            <>
              {/* Left Column: Active Racer Telemetry HUD */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6 order-2 lg:order-1">
                <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl relative overflow-hidden transform-gpu [will-change:transform]">
                  {/* Top Accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
                    style={{ backgroundColor: activeRacer.color || '#fff' }}
                  />

              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-white tracking-widest">
                  SERIAL {activeRacer.serial}
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  ACTIVE DOSSIER
                </span>
              </div>

              <h3
                className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wide"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
              >
                SERIAL {activeRacer.serial}
              </h3>

              {/* Stats Matrix */}
              <div className="grid grid-cols-2 gap-3 my-6">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Gauge className="w-3.5 h-3.5 text-white/70" />
                    <span>TOP SPEED</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white">
                    {activeRacer.stats.speed} <span className="text-xs font-normal text-white/50">MPH</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Zap className="w-3.5 h-3.5 text-white/70" />
                    <span>ACCEL</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white">
                    {activeRacer.stats.acceleration}<span className="text-xs font-normal text-white/50">/100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Shield className="w-3.5 h-3.5 text-white/70" />
                    <span>GRIT</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white">
                    {activeRacer.stats.grit}<span className="text-xs font-normal text-white/50">/100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Compass className="w-3.5 h-3.5 text-white/70" />
                    <span>HANDLING</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white">
                    {activeRacer.stats.handling}<span className="text-xs font-normal text-white/50">/100</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRacer(activeRacer)}
                  className="flex-1 min-w-[140px] py-3 px-5 rounded-xl bg-white text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>INSPECT DOSSIER</span>
                </button>

                <button
                  type="button"
                  onClick={() => cardSwapRef.current?.swapPrev()}
                  className="py-3 px-3 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
                  title="Previous Card"
                  aria-label="Previous racer card"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => cardSwapRef.current?.swap()}
                  className="py-3 px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Next Card"
                  aria-label="Next racer card"
                >
                  <span className="text-xs font-bold font-mono">NEXT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => cardSwapRef.current?.resetDeck()}
                  className="py-3 px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-white/70 font-mono text-xs hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset Original Order"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">RESET</span>
                </button>
              </div>
            </div>

            {/* Active Card Indicator Strip */}
            <div className="flex items-center justify-between px-3 text-xs font-mono text-white/50">
              <div className="flex items-center gap-2">
                <span>PILOT:</span>
                <span className="text-white font-bold">
                  {String(activeCardIndex + 1).padStart(2, '0')} / {String(racersList.length).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {racersList.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const diff = (i - activeCardIndex + racersList.length) % racersList.length;
                      for (let step = 0; step < diff; step++) {
                        setTimeout(() => cardSwapRef.current?.swap(), step * 180);
                      }
                    }}
                    aria-label={`Jump to racer ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeCardIndex === i ? 'w-6 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Perspective CardSwap Animation Container */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-4 sm:py-8 px-2 sm:px-4 overflow-visible order-1 lg:order-2">
            {/* Mobile Touch Gesture Pill */}
            <div className="flex sm:hidden items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white/80 animate-pulse">
              <Hand className="w-3 h-3 text-amber-400" />
              <span>SWIPE LEFT / RIGHT TO CYCLE</span>
            </div>

            <div
              className="relative flex items-center justify-center transform-gpu [will-change:transform]"
              style={{
                width: cardDimensions.width + 50,
                height: cardDimensions.height + 40
              }}
            >
              <CardSwap
                ref={cardSwapRef}
                width={cardDimensions.width}
                height={cardDimensions.height}
                cardDistance={cardDimensions.cardDistance}
                verticalDistance={cardDimensions.verticalDistance}
                delay={4500}
                pauseOnHover={true}
                skewAmount={cardDimensions.skewAmount}
                easing="elastic"
                onActiveChange={handleActiveChange}
                onCardClick={(idx) => {
                  const clicked = racersList[idx];
                  if (clicked) setSelectedRacer(clicked);
                }}
              >
                {racersList.map((racer) => (
                  <Card
                    key={racer.id}
                    customClass="cursor-pointer group overflow-hidden border border-white/15 hover:border-white/50 transition-colors duration-300 transform-gpu [will-change:transform]"
                    style={{
                      background: `linear-gradient(170deg, #18181b 0%, #09090b 100%)`,
                      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px -5px ${racer.color}20`,
                    }}
                  >
                    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 transform-gpu">
                      {/* Top Header Row on Card */}
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-white tracking-widest">
                            {racer.serial}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          PILOT // RIG
                        </span>
                      </div>

                      {/* Character Visual Showcase with Skeletal Loading */}
                      <RacerCardVisual racer={racer} />

                      {/* Card Bottom Specs */}
                      <div className="z-10 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4
                              className="text-lg sm:text-xl font-black uppercase text-white tracking-wide"
                              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                            >
                              SERIAL {racer.serial}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-white/40 block uppercase">SPEED</span>
                            <span className="text-xs sm:text-sm font-bold font-mono text-white">
                              {racer.stats.speed} <span className="text-[10px] text-white/50">MPH</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Modal Profile Viewer */}
      {selectedRacer && (
        <div
          id="racer-profile-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedRacer(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-white/20 overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto transform-gpu [will-change:transform]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 text-white"
              style={{ backgroundColor: selectedRacer.panelColor }}
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <div>
                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80 block">
                    SECTOR ARCHIVE // DOSSIER
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-black uppercase tracking-wide leading-none"
                    style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                  >
                    SERIAL {selectedRacer.serial}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRacer(null)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
              {/* Visual Showcase with Skeletal Loading */}
              <DossierModalVisual racer={selectedRacer} />

              {/* Telemetry Stats Grid */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/50 block mb-3">
                  CIRCUIT TELEMETRY
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">TOP SPEED</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.speed} MPH
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">ACCELERATION</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.acceleration}/100
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">GRIT</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">
                      {selectedRacer.stats.grit}/100
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-zinc-900 border border-white/10">
                    <span className="text-[10px] font-mono text-white/50 block uppercase">HANDLING</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">
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
                <div className="flex items-center gap-3">
                  <a
                    href="https://opensea.io/collection/lastlaprh"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-zinc-900 border border-cyan-400/40 text-cyan-400 font-mono font-bold text-xs tracking-widest uppercase hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all flex items-center gap-2 no-underline"
                  >
                    <OpenSeaLogo className="w-3.5 h-3.5" />
                    <span>VIEW ON OPENSEA</span>
                  </a>
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
        </div>
      )}
    </section>
  );
}
