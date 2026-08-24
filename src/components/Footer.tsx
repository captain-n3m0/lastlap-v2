/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { ArrowRight, ExternalLink, ArrowUp, Sparkles, MapPin, Compass } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Official SVG vector logos for X and Discord
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

export default function Footer() {
  const giantLogoRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      if (ctaCardRef.current) {
        gsap.fromTo(
          ctaCardRef.current,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaCardRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (giantLogoRef.current) {
        gsap.fromTo(
          giantLogoRef.current,
          { yPercent: 20, opacity: 0.1 },
          {
            yPercent: 0,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="bg-black text-white relative overflow-hidden select-none border-t border-white/10"
    >
      {/* Final CTA Magazine Feature Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 sm:pt-40 pb-24 border-b border-white/10 relative z-10">
        <div ref={ctaCardRef} className="velocity-skew p-10 sm:p-20 rounded-3xl bg-zinc-950 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-[11px] font-mono font-bold tracking-[0.35em] text-white/60 uppercase block mb-4">
              [ THE FINAL SECTOR AWAITS // ISSUE Nº 01 ]
            </span>

            <h2
              className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-wide leading-[0.9] mb-6"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
            >
              YOUR STORY
              <br />
              <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                STARTS HERE.
              </span>
            </h2>

            <p className="text-base sm:text-xl font-sans text-white/90 tracking-normal mb-10 max-w-2xl mx-auto font-medium">
              “The road is open. Choose your racer and leave your tire marks in the desert sand.”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a
                href="#hero"
                id="footer-start-journey-btn"
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black font-mono text-sm sm:text-base tracking-widest uppercase rounded-2xl hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl no-underline"
              >
                <span>START THE JOURNEY</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </a>

              <a
                href="https://discord.gg/lastlaprh"
                target="_blank"
                rel="noreferrer"
                id="footer-join-community-btn"
                className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white border border-white/30 font-black font-mono text-sm sm:text-base tracking-widest uppercase rounded-2xl hover:bg-zinc-800 hover:border-white transition-all flex items-center justify-center gap-3 no-underline"
              >
                <DiscordLogo className="w-5 h-5" />
                <span>JOIN DISCORD</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Colophon Spreads */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16">
          {/* Col 1: Brand info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded border border-white/80 p-0.5 grid grid-cols-3 grid-rows-2 gap-0.5 bg-black">
                <div className="bg-white rounded-xs"></div>
                <div className="bg-transparent"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-transparent"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-transparent"></div>
              </div>
              <span
                className="text-2xl sm:text-3xl font-black tracking-wide uppercase"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
              >
                LASTLAP
              </span>
            </div>
            <p className="text-xs font-mono text-white/60 leading-relaxed">
              2,525 genesis desert racers battling across provably fair circuits. Built on Ethereum for the global Web3 motorsports collective.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com/lastlaprh?s=11"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-11 h-11 rounded-2xl bg-zinc-950/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="https://discord.gg/lastlaprh"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-11 h-11 rounded-2xl bg-zinc-950/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <DiscordLogo className="w-4 h-4" />
              </a>
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noreferrer"
                aria-label="OpenSea Collection"
                className="w-11 h-11 rounded-2xl bg-zinc-950/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-[0.25em] mb-5">
              CIRCUIT GRID
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-white/70">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">HOME & CAROUSEL</a>
              </li>
              <li>
                <a href="#racers" className="hover:text-white transition-colors">MEET THE RACERS</a>
              </li>
              <li>
                <a href="#token" className="hover:text-white transition-colors">LAP TOKEN ENGINE</a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors">ROADMAP & CHECKPOINTS</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">ORIGIN MANIFESTO</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Tools */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-[0.25em] mb-5">
              PADDOCK INTEL
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-white/70">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FREQUENTLY ASKED QUESTIONS</a>
              </li>
              <li>
                <a href="#token" className="hover:text-white transition-colors">TOKEN AUDIT SPEC</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">ROBINHOOD ECOSYSTEM PROTOCOL</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Coordinates & Scroll top */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-[0.25em] mb-5">
                COLOPHON
              </h4>
              <div className="space-y-2 text-xs font-mono text-white/60">
                <p>ISSUE: 01 // VOL. 2525</p>
                <p>SECTOR: 34°12&apos;N 115°45&apos;W</p>
                <p>NETWORK: ETHEREUM MAINNET</p>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              id="footer-back-to-top-btn"
              className="mt-6 sm:mt-0 inline-flex items-center gap-2 text-xs font-mono font-bold text-white/70 hover:text-white py-2 cursor-pointer w-fit"
            >
              <ArrowUp className="w-4 h-4" />
              <span>RETURN TO TOP</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/50 gap-4">
          <span>© 2024–2026 LASTLAP DOT FUN. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-4 uppercase">
            <span>TERMS OF RACING</span>
            <span>•</span>
            <span>PRIVACY DISPATCH</span>
            <span>•</span>
            <span>PROVABLY FAIR DISCLOSURE</span>
          </div>
        </div>
      </div>

      {/* Giant Parallax Editorial Backcover Text */}
      <div
        ref={giantLogoRef}
        className="w-full text-center pointer-events-none select-none overflow-hidden leading-none opacity-20 -mb-8 sm:-mb-14"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(80px, 24vw, 320px)',
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
        }}
      >
        LASTLAP
      </div>
    </footer>
  );
}
