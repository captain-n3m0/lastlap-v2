/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ROADMAP_PHASES } from '../data/mockData';
import { Flag, CheckCircle2, PlayCircle, Clock, MapPin, Sparkles, Navigation } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // 2. Cards Stagger Reveal
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 82%',
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
      id="roadmap"
      className="py-32 sm:py-44 bg-[#070707] relative border-b border-white/10 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                CHAPTER 05 // STRATEGIC EXPEDITION
              </span>
              <div ref={headerLineRef} className="h-[1px] w-12 bg-white/20 origin-left"></div>
              <span className="text-[11px] font-mono text-red-400 tracking-widest uppercase flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" />
                4 CHECKPOINTS
              </span>
            </div>

            <h2
              ref={titleRef}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-wide leading-[0.9]"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
            >
              RALLY
              <br />
              <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                ROADMAP.
              </span>
            </h2>
          </div>

          <p ref={subtitleRef} className="text-sm sm:text-base font-sans text-white/80 max-w-md leading-relaxed font-normal">
            Our strategic trajectory across the desert horizon. Milestone checkpoints tracking genesis deployment through decentralized syndicate championships.
          </p>
        </div>

        {/* Checkpoint Timeline Grid with GSAP Parallax Stagger */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {ROADMAP_PHASES.map((phase, idx) => {
            const isCompleted = phase.status === 'Completed';
            const isActive = phase.status === 'Active';

            return (
              <div
                key={phase.phase}
                id={`roadmap-checkpoint-${idx + 1}`}
                className={`velocity-skew p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative shadow-2xl ${
                  isActive
                    ? 'bg-zinc-900 border-amber-400/80 shadow-amber-500/10 scale-[1.03] ring-1 ring-amber-400/40'
                    : isCompleted
                    ? 'bg-zinc-950/90 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/40'
                }`}
              >
                <div>
                  {/* Status Badges */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-black text-white/50 tracking-widest uppercase">
                      {phase.phase}
                    </span>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COMPLETED
                      </span>
                    )}

                    {isActive && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase animate-pulse">
                        <PlayCircle className="w-3.5 h-3.5" />
                        IN PROGRESS
                      </span>
                    )}

                    {!isCompleted && !isActive && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 text-white/50 border border-white/10 uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        QUEUED
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide mb-4"
                    style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
                  >
                    {phase.title}
                  </h3>

                  <p className="text-xs font-mono text-white/70 leading-relaxed mb-8">
                    {phase.description}
                  </p>
                </div>

                {/* Milestone Details */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  {phase.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          isCompleted ? 'bg-emerald-400' : isActive ? 'bg-amber-400' : 'bg-white/30'
                        }`}
                      />
                      <span className="text-[11px] font-mono text-white/80 leading-normal">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
