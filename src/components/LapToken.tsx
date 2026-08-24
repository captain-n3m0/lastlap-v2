/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TOKEN_UTILITIES } from '../data/mockData';
import { ArrowRight, Coins, Zap, Shield, Flame, CheckCircle2, ChevronRight, TrendingUp, Lock, Percent } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LapToken() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);
  const specCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header Reveal
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

      // 2. Stat Callouts Stagger
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 3. Matrix Cards Stagger Reveal
      if (matrixRef.current) {
        gsap.fromTo(
          matrixRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: matrixRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 4. Specification Card Reveal
      if (specCardRef.current) {
        gsap.fromTo(
          specCardRef.current,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: specCardRef.current,
              start: 'top 85%',
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
      id="token"
      className="py-32 sm:py-44 bg-black relative border-b border-white/10 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Editorial Section Masthead */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                CHAPTER 03 // PROTOCOL TOKENOMICS
              </span>
              <div ref={headerLineRef} className="h-[1px] w-12 bg-white/20 origin-left"></div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono font-bold text-amber-400 tracking-widest uppercase animate-pulse">
                COMING SOON
              </span>
            </div>

            <h2
              ref={titleRef}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-wide leading-[0.9]"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
            >
              $LAP TOKEN
              <br />
              <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                ECONOMICS.
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 max-w-md">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>TOKENOMICS ARCHITECTURE IN DEVELOPMENT</span>
            </div>
            <p ref={subtitleRef} className="text-sm sm:text-base font-sans text-white/70 leading-relaxed font-normal">
              The official $LAP economic engine specifications, liquidity bootstrapping pools, and genesis staking dividends are currently being finalized for mainnet launch.
            </p>
          </div>
        </div>

        {/* Coming Soon Hero Banner / Teaser Matrix */}
        <div className="relative rounded-3xl border border-white/10 bg-zinc-950/80 p-8 sm:p-12 mb-16 overflow-hidden">
          {/* Subtle Grid Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.06),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold text-white/50 tracking-[0.25em] uppercase block mb-1">
                STATUS // PRE-FLIGHT LOCK
              </span>
              <h3
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                COMING SOON TO MAINNET
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-white/80 uppercase">
                CONTRACT AUDIT & TGE IN QUEUE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Coins className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SUPPLY ALLOCATION</span>
              </div>
              <span className="text-xl font-bold text-white font-mono">100M FIXED CAP</span>
              <span className="text-[11px] font-mono text-white/50 mt-1">Deflationary Wager Burns</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Percent className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">CIRCUIT STAKING</span>
              </div>
              <span className="text-xl font-bold text-white font-mono">REAL-YIELD APY</span>
              <span className="text-[11px] font-mono text-white/50 mt-1">Racer Staking Dividends</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">TRANSACTIONS</span>
              </div>
              <span className="text-xl font-bold text-white font-mono">0% TAX MODEL</span>
              <span className="text-[11px] font-mono text-white/50 mt-1">Zero Friction Transfers</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SECURITY</span>
              </div>
              <span className="text-xl font-bold text-white font-mono">MULTI-SIG VAULT</span>
              <span className="text-[11px] font-mono text-white/50 mt-1">Audited Token Architecture</span>
            </div>
          </div>
        </div>

        {/* High-Impact Stat Callouts */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20"
        >
          <div className="velocity-skew p-5 sm:p-6 lg:p-6 xl:p-8 rounded-3xl bg-zinc-950 shadow-xl flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">
                TOTAL SUPPLY
              </span>
              <h3
                className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-white leading-tight tracking-normal"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                100,000,000
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-emerald-400 mt-3 block font-semibold">
              FIXED CAP // NO INFLATION
            </span>
          </div>

          <div className="velocity-skew p-5 sm:p-6 lg:p-6 xl:p-8 rounded-3xl bg-zinc-950 shadow-xl flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">
                RACER STAKING APY
              </span>
              <h3
                className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-amber-400 leading-tight tracking-normal"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                24.8%
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/60 mt-3 block">
              REAL-YIELD CIRCUIT DOCK
            </span>
          </div>

          <div className="velocity-skew p-5 sm:p-6 lg:p-6 xl:p-8 rounded-3xl bg-zinc-950 shadow-xl flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">
                TRANSACTION TAX
              </span>
              <h3
                className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-white leading-tight tracking-normal"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                0.0%
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/60 mt-3 block">
              ZERO BUY / SELL TAX
            </span>
          </div>

          <div className="velocity-skew p-5 sm:p-6 lg:p-6 xl:p-8 rounded-3xl bg-zinc-950 shadow-xl flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-2">
                BURN MECHANISM
              </span>
              <h3
                className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-red-400 leading-tight tracking-normal"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                15.0%
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/60 mt-3 block">
              ALL WAGER FEES BURNED
            </span>
          </div>
        </div>

        {/* Token Manifest Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-start">
          {/* Left Column: 6 Utility Allocations */}
          <div ref={matrixRef} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOKEN_UTILITIES.map((utility, idx) => {
              const isSelected = activeTab === idx;
              return (
                <div
                  key={utility.title}
                  id={`token-util-card-${idx}`}
                  onClick={() => setActiveTab(idx)}
                  className={`velocity-skew p-7 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-white text-white shadow-2xl scale-[1.02]'
                      : 'bg-zinc-950/90 border-white/10 text-white/80 hover:border-white/40 hover:bg-zinc-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-white/10 text-white border border-white/20">
                        {utility.tag}
                      </span>
                      <span className="text-2xl font-mono font-black text-amber-400">
                        {utility.percent}
                      </span>
                    </div>

                    <h3
                      className="text-2xl font-black text-white uppercase tracking-wide mb-2"
                      style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                    >
                      {utility.title}
                    </h3>

                    <p className="text-xs font-mono text-white/70 leading-relaxed">
                      {utility.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono font-bold text-white/50">
                    <span>INSPECT ALLOCATION</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Display Card */}
          <div ref={specCardRef} className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-zinc-950 shadow-2xl relative overflow-hidden">
            <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-[0.3em] block mb-2">
              ALLOCATION SPECIFICATION
            </span>

            <h3
              className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide mb-4"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
            >
              {TOKEN_UTILITIES[activeTab].title}
            </h3>

            <p className="text-sm font-mono text-white/80 leading-relaxed mb-6">
              {TOKEN_UTILITIES[activeTab].description}
            </p>

            {/* Allocation Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-2">
                <span>CIRCULATION RATIO</span>
                <span className="font-bold text-amber-400">{TOKEN_UTILITIES[activeTab].percent}</span>
              </div>
              <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: TOKEN_UTILITIES[activeTab].percent }}
                ></div>
              </div>
            </div>

            {/* Highlights Checklist */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs font-mono text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audited onchain token contracts with multi-sig security.</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Immediate utility upon genesis mint: staking + circuit fees.</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Robinhood Web3 Ecosystem native interoperability.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
