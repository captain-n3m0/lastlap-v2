/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Compass, Flame, Shield, Globe, Users, Gamepad2, Award, Sparkles, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const robinhoodBoxRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

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
      }

      // 2. Narrative paragraph & Robinhood box reveal
      if (narrativeRef.current) {
        gsap.fromTo(
          narrativeRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: narrativeRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (robinhoodBoxRef.current) {
        gsap.fromTo(
          robinhoodBoxRef.current,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: robinhoodBoxRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 3. Pillars Stagger
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 88%',
            },
          }
        );
      }

      // 4. Parallax & reveal on Visual Showcase Plate
      if (visualRef.current) {
        gsap.fromTo(
          visualRef.current,
          { opacity: 0, scale: 0.93, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: visualRef.current,
              start: 'top 80%',
            },
          }
        );

        gsap.to(visualRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // 5. Quote Banner Reveal
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: quoteRef.current,
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
      id="about"
      className="py-32 sm:py-44 bg-black relative border-b border-white/10 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          {/* Left Column: Narrative Article */}
          <div className="lg:col-span-7 space-y-8">
            <div ref={headerRef} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                  CHAPTER 05 // MANIFESTO & ORIGINS
                </span>
                <div ref={headerLineRef} className="h-[1px] w-12 bg-white/20 origin-left"></div>
                <span className="text-[11px] font-mono text-white/60 tracking-widest uppercase">
                  EST. 2024
                </span>
              </div>

              <h2
                ref={titleRef}
                className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-wide leading-[0.9]"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
              >
                ABOUT
                <br />
                <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                  LASTLAP.
                </span>
              </h2>
            </div>

            <div ref={narrativeRef} className="space-y-6 text-base sm:text-lg font-sans text-white/85 leading-relaxed font-normal">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                LastLap is a racing-inspired Web3 ecosystem launching on the Robinhood Network, built around a collection of unique rider NFTs, strong community culture, and digital ownership.
              </p>

              <p className="text-white/75 leading-relaxed">
                The LastLap NFT collection brings together racing, street culture, adventure, and identity through distinctive rider characters designed to represent the community. As the ecosystem grows, holders will be able to take part in future experiences, utilities, rewards, collaborations, and community-driven activities.
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>LastLap NFTs — Coming Soon on Robinhood</span>
                </div>
              </div>
            </div>

            {/* Robinhood Affiliation Callout Box */}
            <div ref={robinhoodBoxRef} className="velocity-skew p-8 rounded-3xl bg-zinc-950 relative overflow-hidden shadow-2xl">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-[0.25em] block mb-1">
                    ECOSYSTEM AFFILIATION
                  </span>
                  <h4
                    className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-2"
                    style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.04em' }}
                  >
                    DESIGNED AROUND THE ROBINHOOD ECOSYSTEM
                  </h4>
                  <p className="text-sm font-sans text-white/80 leading-relaxed font-normal">
                    Engineered for high-volume accessibility, native wallet bridging, and seamless Web3 motorsport adoption with zero friction for the next million pilots.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Pillars */}
            <div ref={pillarsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="velocity-skew p-6 rounded-2xl bg-zinc-950">
                <Users className="w-6 h-6 text-white mb-3" />
                <h5
                  className="text-lg font-black text-white uppercase tracking-wide mb-1"
                  style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                >
                  2,525 RIDERS
                </h5>
                <p className="text-xs font-mono text-white/60">Fixed genesis supply, never diluted.</p>
              </div>

              <div className="velocity-skew p-6 rounded-2xl bg-zinc-950">
                <Gamepad2 className="w-6 h-6 text-white mb-3" />
                <h5
                  className="text-lg font-black text-white uppercase tracking-wide mb-1"
                  style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                >
                  ARCADE GAMES
                </h5>
                <p className="text-xs font-mono text-white/60">Verifiable cryptographic arcade games.</p>
              </div>

              <div className="velocity-skew p-6 rounded-2xl bg-zinc-950">
                <Award className="w-6 h-6 text-white mb-3" />
                <h5
                  className="text-lg font-black text-white uppercase tracking-wide mb-1"
                  style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                >
                  DEEP UTILITY
                </h5>
                <p className="text-xs font-mono text-white/60">Direct gaming, $LAP yields & staking.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase Plate */}
          <div ref={visualRef} className="lg:col-span-5 relative">
            <div className="velocity-skew rounded-3xl p-6 sm:p-8 bg-zinc-950 shadow-2xl relative overflow-hidden flex flex-col items-center">
              {/* Image plate */}
              <div className="w-full aspect-[4/5] rounded-2xl bg-black relative overflow-hidden flex items-center justify-center p-4">
                <img
                  src="https://cdn.lastlap.fun/b72dc863-6a64-46d8-a3a7-ec97a5ff01bc.png"
                  alt="Desert backdrop"
                  className="absolute inset-0 w-full h-full object-cover opacity-45"
                />
                <img
                  src="https://cdn.lastlap.fun/Adobe%20Express%20-%20file%20(1).png"
                  alt="LastLap Racer"
                  className="relative z-10 w-4/5 h-4/5 object-contain object-bottom hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-[10px] font-mono text-white font-bold uppercase tracking-widest">
                  PLATE Nº 017
                </div>
              </div>

              <div className="w-full mt-5 p-4 rounded-xl bg-black flex items-center justify-between font-mono text-xs">
                <span className="text-white/70">SECTOR: 01 // DESERT RUN</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">GRID ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Pull Quote Banner */}
        <div
          ref={quoteRef}
          className="velocity-skew p-10 sm:p-16 rounded-3xl bg-zinc-950 text-center relative overflow-hidden"
        >
          <p
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-wide leading-tight max-w-5xl mx-auto"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.04em' }}
          >
            “SPEED IS NOT A MEASUREMENT. IT IS A PHILOSOPHY OF ABSOLUTE CLARITY.”
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-xs font-mono text-white/50 tracking-[0.3em] uppercase">
            <span>LASTLAP GENESIS MANIFESTO</span>
            <span>//</span>
            <span>AUTONOMOUS DESERT CIRCUIT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
