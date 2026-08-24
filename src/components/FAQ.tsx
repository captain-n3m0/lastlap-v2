/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { HelpCircle, ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

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

        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
          );
        }

        if (subtitleRef.current) {
          tl.fromTo(
            subtitleRef.current,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.5'
          );
        }
      }

      // 2. Accordion Items Stagger
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { y: 35, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: listRef.current,
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
      id="faq"
      className="py-32 sm:py-44 bg-[#080808] relative border-b border-white/10 text-white overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white/70 mb-4 uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            CHAPTER 06 // INTEL DISPATCH
          </div>
          <h2
            ref={titleRef}
            className="text-5xl sm:text-7xl font-black text-white uppercase tracking-wide mb-4"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
          >
            FREQUENTLY ASKED
            <br />
            <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
              QUESTIONS.
            </span>
          </h2>
          <p ref={subtitleRef} className="text-sm sm:text-base font-sans text-white/80 font-normal">
            Critical intelligence before entering the circuit.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div ref={listRef} className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                id={`faq-item-${idx + 1}`}
                className={`velocity-skew rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-950 border-white/40 shadow-2xl scale-[1.01]'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-7 text-left flex items-center justify-between gap-6 cursor-pointer"
                >
                  <span className="text-lg sm:text-xl font-bold font-sans text-white flex items-center gap-4">
                    <span className="text-xs font-mono text-white/50 font-bold">
                      0{idx + 1}
                    </span>
                    {item.question}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-7 pb-7 pt-2 text-sm sm:text-base font-sans text-white/85 leading-relaxed font-normal border-t border-white/10">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
