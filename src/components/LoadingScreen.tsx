/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING TELEMETRY');
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0.6 : 2.0;

    const statuses = [
      { at: 15, text: 'WARMING ENGINE COILS' },
      { at: 40, text: 'CALIBRATING RACING RETICLE' },
      { at: 70, text: 'SYNCHRONIZING CHASSIS DOSSIER' },
      { at: 90, text: 'GRID POSITIONS LOCKED' },
      { at: 100, text: 'GREEN FLAG READY' },
    ];

    const proxy = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            setIsDone(true);
            onComplete?.();
          },
        });

        exitTl.to(
          ['.loader-fade-out'],
          {
            y: -20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power3.in',
          }
        );

        exitTl.to(
          containerRef.current,
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
            duration: 0.8,
            ease: 'expo.inOut',
          },
          '-=0.1'
        );
      },
    });

    tl.to(proxy, {
      val: 100,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const currentVal = Math.round(proxy.val);
        setProgress(currentVal);

        const activeStatus = statuses.slice().reverse().find((s) => currentVal >= s.at);
        if (activeStatus) {
          setStatusText(activeStatus.text);
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      id="app-loading-screen"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      }}
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#050505] text-white p-6 sm:p-12 select-none pointer-events-auto overflow-hidden font-mono"
    >
      {/* Top Header Bar */}
      <div className="loader-fade-out flex items-center justify-between border-b border-white/10 pb-4 text-[11px] tracking-[0.25em] text-white/50">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold text-white uppercase tracking-widest">LAST LAP // GRAND PRIX</span>
        </div>
        <div className="hidden sm:block">SYSTEM PROTOCOL 01 // HIGH SPEED</div>
        <div className="text-white/80 font-bold">GRID V1.0</div>
      </div>

      {/* Center Hero Graphic & Counter */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        {/* RPM / Speed Dial Minimal Display */}
        <div ref={logoRef} className="loader-fade-out mb-6 flex flex-col items-center">
          <div className="text-xs font-bold text-white/40 tracking-[0.3em] uppercase mb-2">
            PRE-RACE DIAGNOSTIC
          </div>
          <div
            className="text-7xl sm:text-9xl font-black tracking-tighter text-white"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            LAST LAP
          </div>
        </div>

        {/* Dynamic Percentage Number */}
        <div className="loader-fade-out flex items-baseline gap-2 mb-8">
          <span
            ref={counterRef}
            className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white tabular-nums"
          >
            {progress.toString().padStart(3, '0')}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-red-500 font-mono">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="loader-fade-out w-full max-w-md bg-white/10 h-[3px] rounded-full overflow-hidden relative mb-4">
          <div
            ref={barRef}
            className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Status Message */}
        <div className="loader-fade-out text-xs text-white/60 font-mono tracking-widest uppercase flex items-center gap-2">
          <span className="text-red-500 font-black">&gt;</span>
          <span>{statusText}</span>
        </div>
      </div>

      {/* Bottom Footer Data */}
      <div className="loader-fade-out flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-4 text-[10px] sm:text-[11px] tracking-[0.2em] text-white/40 gap-2">
        <div className="flex items-center gap-4">
          <span>LAT: 35.6762° N</span>
          <span>LON: 139.6503° E</span>
          <span className="text-white/80">CIRCUIT TOKYO BAY</span>
        </div>
        <div className="text-white/60">
          ALL SYSTEMS NOMINAL &bull; 2026 EDITION
        </div>
      </div>
    </div>
  );
}
