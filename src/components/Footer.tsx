/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { ArrowRight, MessageSquare, Twitter, Disc, ExternalLink, ArrowUp, Sparkles, MapPin, Compass } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                id="footer-join-community-btn"
                className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white border border-white/30 font-black font-mono text-sm sm:text-base tracking-widest uppercase rounded-2xl hover:bg-zinc-800 hover:border-white transition-all flex items-center justify-center gap-3 no-underline"
              >
                <MessageSquare className="w-5 h-5" />
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
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <Disc className="w-4 h-4" />
              </a>
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noreferrer"
                aria-label="OpenSea Collection"
                className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-colors"
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
          <span>© 2024–2026 LASTLAP LABS. ALL RIGHTS RESERVED.</span>
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
