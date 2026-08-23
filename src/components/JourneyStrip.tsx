/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Layers, Flame, Trophy, ArrowUpRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function JourneyStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Section Header Reveal Animation
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

      // 2. Step Cards Reveal Animation & Parallax Stagger
      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current.children,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Continuous subtle parallax on step cards during scroll
      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          y: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      if (card3Ref.current) {
        gsap.to(card3Ref.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // 3. Editorial Pull Quote Reveal
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
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

  const steps = [
    {
      ref: card1Ref,
      num: '01',
      title: 'COLLECT',
      icon: Layers,
      category: 'PRIMARY GENESIS',
      tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      description: 'Discover 2,525 unique hand-drawn desert racers with rare mechanical traits, bespoke backstories, and performance tuning specs.',
      specs: ['2,525 SUPPLY', '100% HAND-DRAWN', 'IMMUTABLE METADATA'],
    },
    {
      ref: card2Ref,
      num: '02',
      title: 'RACE',
      icon: Flame,
      category: 'ONCHAIN TRACKS',
      tagColor: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
      description: 'Strap in and enter the proving grounds. Provably fair racing mechanics simulate terrain coefficient, turbo timing, and fuel strategy.',
      specs: ['REAL-TIME RUNS', 'TELEMETRY ENGINE', 'PROVABLY FAIR'],
    },
    {
      ref: card3Ref,
      num: '03',
      title: 'EARN',
      icon: Trophy,
      category: 'CIRCUIT ECONOMY',
      tagColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      description: 'Claim your victory slice. Race for $LAP token staking yields, syndicate circuit prize pools, and exclusive garage access.',
      specs: ['CIRCUIT YIELD', 'ROBINHOOD PERKS', '$LAP REWARDS'],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-32 sm:py-44 bg-[#070707] text-white border-t border-b border-white/10 overflow-hidden"
    >
      {/* Background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Editorial Masthead Header with GSAP Reveal */}
        <div ref={headerRef} className="mb-24 sm:mb-32">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
              CHAPTER 01 // THE PILOT'S JOURNEY
            </span>
            <div ref={headerLineRef} className="h-[1px] w-12 bg-white/20 origin-left"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                ref={titleRef}
                className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                COLLECT.
                <br />
                <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                  RACE.
                </span>{' '}
                EARN.
              </h2>
            </div>
            <div ref={subtitleRef} className="lg:col-span-4 pb-2">
              <p className="text-sm sm:text-base font-mono text-white/70 leading-relaxed">
                Three interconnected pillars driving high-velocity competition and genuine digital sovereignty across the desert frontier.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest">
                <span>CIRCULATION: 2,525</span>
                <span>•</span>
                <span>DESERT PROTOCOL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Steps Editorial Magazine Cards Grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-32"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                ref={step.ref}
                id={`journey-step-${step.title.toLowerCase()}`}
                className="velocity-skew relative p-8 sm:p-10 rounded-2xl bg-zinc-950/90 border border-white/10 flex flex-col justify-between hover:border-white/40 hover:bg-zinc-900/90 transition-all duration-300 group shadow-2xl"
              >
                {/* Number & Icon header */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="text-5xl sm:text-6xl font-black text-white/20 group-hover:text-white transition-colors tracking-tighter"
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      {step.num}
                    </span>
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white/30 transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <span className={`inline-block px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest border mb-4 ${step.tagColor}`}>
                    {step.category}
                  </span>

                  <h3
                    className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4 group-hover:translate-x-1 transition-transform"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {step.title}
                  </h3>

                  <p className="text-sm text-white/70 font-mono leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Specs Pill Badges */}
                <div className="space-y-4">
                  <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
                    {step.specs.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 tracking-wider"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#racers"
                    className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-white/60 group-hover:text-white no-underline"
                  >
                    <span>ENTER SYSTEM</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Magazine Pull Quote Divider with generous whitespace */}
        <div ref={quoteRef} className="mt-28 sm:mt-36 text-center max-w-4xl mx-auto px-4">
          <span className="text-white/30 text-6xl font-serif leading-none block mb-2">“</span>
          <p
            className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            IN THE DESERT, NO ONE HEARS THE ENGINE SCREAM BUT THE HORIZON.
          </p>
        </div>
      </div>
    </section>
  );
}
