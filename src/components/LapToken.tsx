/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Lock, Coins, Zap, Shield, Percent, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// SVG vector logos for X and Discord
function XLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function LapToken() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

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

      // 2. Banner Reveal
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { y: 50, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bannerRef.current,
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
      className="py-28 sm:py-36 bg-black relative border-b border-white/10 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Editorial Section Masthead */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-8">
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

        {/* Dedicated Coming Soon Showcase Card */}
        <div
          ref={bannerRef}
          className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-black p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* Top Bar Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  STATUS: PRE-FLIGHT PROTOCOL LOCK
                </span>
              </div>

              <div className="text-[11px] font-mono text-white/50 tracking-wider">
                CONTRACT AUDIT & TGE IN QUEUE
              </div>
            </div>

            {/* Hero Heading & Narrative */}
            <div className="py-10 sm:py-14 max-w-3xl">
              <span className="text-xs font-mono font-bold text-white/40 tracking-[0.3em] uppercase block mb-3">
                THE ECONOMIC ENGINE // VOL. 2525
              </span>
              <h3
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.95] mb-6"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.04em' }}
              >
                COMING SOON TO MAINNET.
              </h3>
              <p className="text-sm sm:text-base font-sans text-white/70 leading-relaxed font-normal max-w-2xl">
                The immutable economic engine powering racing game wagers, paddock garage tuning, genesis pilot staking dividends, and decentralized tournament governance is currently undergoing contract architecture reviews.
              </p>
            </div>

            {/* Architecture Preview Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 pb-10 border-b border-white/10">
              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <Coins className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SUPPLY ALLOCATION</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white font-mono block">COMING SOON</span>
                  <span className="text-xs font-mono text-white/50 mt-1 block">To Be Announced</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <Percent className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">CIRCUIT STAKING</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white font-mono block">COMING SOON</span>
                  <span className="text-xs font-mono text-white/50 mt-1 block">To Be Announced</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">TRANSACTIONS</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white font-mono block">COMING SOON</span>
                  <span className="text-xs font-mono text-white/50 mt-1 block">To Be Announced</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">SECURITY</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white font-mono block">MULTI-SIG VAULT</span>
                  <span className="text-xs font-mono text-white/60 mt-1 block">Audited Token Architecture</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Follow Community Updates */}
            <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-xs font-mono text-white/60">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Join our official channels for real-time TGE, liquidity, and token announcement dates.</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/lastlaprh?s=11"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-2xl bg-zinc-900 border border-white/20 hover:border-white text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <XLogo className="w-3.5 h-3.5" />
                  <span>FOLLOW X</span>
                </a>
                <a
                  href="https://discord.gg/lastlaprh"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-2xl bg-white text-black font-mono font-black text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                  <DiscordLogo className="w-3.5 h-3.5" />
                  <span>JOIN DISCORD</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
