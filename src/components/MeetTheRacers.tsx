/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RACERS } from '../data/mockData';
import { Racer } from '../types';
import { X, Eye, Sparkles, MoveRight, RotateCw, Gauge, Zap, Shield, Compass, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CardSwap, Card, CardSwapRef } from './CardSwap';

gsap.registerPlugin(ScrollTrigger);

export default function MeetTheRacers() {
  const [selectedRacer, setSelectedRacer] = useState<Racer | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const cardSwapRef = useRef<CardSwapRef>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const handleActiveChange = useCallback((idx: number) => {
    setActiveCardIndex(idx);
  }, []);

  const racersList = RACERS;
  const activeRacer = racersList[activeCardIndex] || racersList[0];

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
      className="py-28 sm:py-36 bg-[#070707] relative border-b border-white/10 text-white overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent blur-[140px] pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-white/10">
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
            <p className="text-white/60 font-mono text-sm sm:text-base max-w-xl mt-3">
              Perspective dossier showcase. Swap through 2,525 provably fair pilots, custom cyber rigs, and high-velocity telemetry.
            </p>
          </div>
        </div>

        {/* Showcase Grid: Left Dossier Stats + Center CardSwap Deck */}
        <div ref={showcaseRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Column: Active Racer Telemetry HUD */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="p-8 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl relative overflow-hidden">
              {/* Top Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
                style={{ backgroundColor: activeRacer.color || '#fff' }}
              />

              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-white tracking-widest">
                  SERIAL {activeRacer.serial}
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
                  <div className="text-lg font-bold font-mono text-white">
                    {activeRacer.stats.speed} <span className="text-xs font-normal text-white/50">MPH</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Zap className="w-3.5 h-3.5 text-white/70" />
                    <span>ACCEL</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {activeRacer.stats.acceleration}<span className="text-xs font-normal text-white/50">/100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Shield className="w-3.5 h-3.5 text-white/70" />
                    <span>GRIT</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {activeRacer.stats.grit}<span className="text-xs font-normal text-white/50">/100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] font-mono uppercase mb-1">
                    <Compass className="w-3.5 h-3.5 text-white/70" />
                    <span>HANDLING</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    {activeRacer.stats.handling}<span className="text-xs font-normal text-white/50">/100</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRacer(activeRacer)}
                  className="flex-1 py-3 px-5 rounded-xl bg-white text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>INSPECT DOSSIER</span>
                </button>

                <button
                  type="button"
                  onClick={() => cardSwapRef.current?.swap()}
                  className="py-3 px-4 rounded-xl bg-zinc-900 border border-white/15 text-white font-mono text-xs hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
                  title="Next Card"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">SWAP</span>
                </button>

                <button
                  type="button"
                  onClick={() => cardSwapRef.current?.resetDeck()}
                  className="py-3 px-3.5 rounded-xl bg-zinc-900 border border-white/15 text-white/70 font-mono text-xs hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset Original Order"
                >
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* Active Card Indicator Strip */}
            <div className="flex items-center justify-between px-3 text-xs font-mono text-white/50">
              <div className="flex items-center gap-2">
                <span>ACTIVE DECK:</span>
                <span className="text-white font-bold">
                  {String(activeCardIndex + 1).padStart(2, '0')} / {String(racersList.length).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/30 hidden sm:inline">• DRAG CARD TO REORDER</span>
              </div>
              <div className="flex items-center gap-1.5">
                {racersList.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeCardIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Perspective CardSwap Animation Container */}
          <div className="lg:col-span-7 flex items-center justify-center relative py-8 px-4 overflow-visible">
            <div className="relative w-full max-w-[440px] sm:max-w-[480px] h-[480px] sm:h-[520px] flex items-center justify-center">
              <CardSwap
                ref={cardSwapRef}
                width={340}
                height={460}
                cardDistance={30}
                verticalDistance={24}
                delay={4000}
                pauseOnHover={true}
                skewAmount={4}
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
                    customClass="cursor-pointer group overflow-hidden border border-white/15 hover:border-white/50 transition-colors duration-300"
                    style={{
                      background: `linear-gradient(170deg, #18181b 0%, #09090b 100%)`,
                      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px -5px ${racer.color}20`,
                    }}
                  >
                    <div className="relative w-full h-full flex flex-col justify-between p-6">
                      {/* Top Header Row on Card */}
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-white tracking-widest">
                            {racer.serial}
                          </span>
                        </div>
                      </div>

                      {/* Character Visual Showcase */}
                      <div className="relative my-auto w-full h-[250px] flex items-center justify-center overflow-hidden rounded-xl bg-black/40 border border-white/5">
                        {racer.bgImage && (
                          <img
                            src={racer.bgImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-500"
                          />
                        )}
                        <img
                          src={racer.image}
                          alt={racer.name}
                          className="relative z-10 max-h-[90%] max-w-[90%] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                        {/* Hover Prompt Badge */}
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <span>INSPECT</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Card Bottom Specs */}
                      <div className="z-10 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4
                              className="text-xl font-black uppercase text-white tracking-wide"
                              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                            >
                              SERIAL {racer.serial}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-white/40 block uppercase">SPEED</span>
                            <span className="text-sm font-bold font-mono text-white">
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
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-80 block">
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
                  alt={selectedRacer.serial}
                  className="relative z-10 h-full object-contain object-bottom"
                />
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
