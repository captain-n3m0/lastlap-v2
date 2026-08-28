/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronRight, Cpu, Radio, AlertCircle } from 'lucide-react';
import { Racer } from '../types';

interface RacerCardVisualProps {
  racer: Racer;
}

export function RacerCardVisual({ racer }: RacerCardVisualProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative my-auto w-full h-[180px] sm:h-[240px] flex items-center justify-center overflow-hidden rounded-xl bg-black/50 border border-white/10 transform-gpu [will-change:transform]">
      {/* Background Graphic with Load Transition */}
      {racer.bgImage && !imageError && (
        <img
          src={racer.bgImage}
          alt=""
          loading="lazy"
          onLoad={() => setBgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 transform-gpu ${
            bgLoaded ? 'opacity-25 group-hover:opacity-40' : 'opacity-0'
          }`}
        />
      )}

      {/* Speed streak lines */}
      <div className="card-speed-streak absolute inset-0 pointer-events-none opacity-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_6px,rgba(255,255,255,0.06)_6px,rgba(255,255,255,0.06)_8px)] z-0 transform-gpu" />

      {/* High-Tech Skeletal Loading Placeholder */}
      <div
        className={`absolute inset-0 z-15 flex flex-col items-center justify-center p-4 transition-opacity duration-500 bg-zinc-950/80 ${
          imageLoaded && !imageError ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-hidden={imageLoaded}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px] opacity-70 pointer-events-none" />

        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full animate-telemetry-shimmer" />
        </div>

        {/* Cyberpunk corner telemetry brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/20" />

        {/* Wireframe Scanner & Silhouette Icon */}
        <div className="relative flex flex-col items-center justify-center gap-2.5 z-10">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-900/90 border border-white/15 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Spinning Radar Crosshair */}
            <div className="absolute inset-1 rounded-xl border border-dashed border-white/20 animate-[spin_8s_linear_infinite]" />
            <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white/50 animate-pulse" />
          </div>

          {/* Telemetry Status text with pulsing dot */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono font-semibold tracking-wider text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>ACQUIRING RIG // {racer.serial}</span>
          </div>

          {/* Micro telemetry bars skeleton */}
          <div className="flex items-center gap-1 opacity-40 mt-0.5">
            <div className="w-4 h-1 rounded bg-white/40 animate-pulse" />
            <div className="w-8 h-1 rounded bg-white/60 animate-pulse [animation-delay:150ms]" />
            <div className="w-6 h-1 rounded bg-white/40 animate-pulse [animation-delay:300ms]" />
          </div>
        </div>
      </div>

      {/* Main Character Image with Smooth Fade-in */}
      {!imageError ? (
        <img
          src={racer.image}
          alt={racer.name || racer.serial}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`card-main-image relative z-10 max-h-[90%] max-w-[90%] object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-all duration-500 transform-gpu [will-change:transform] ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      ) : (
        /* Fallback Error State */
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-1" />
          <span className="text-[10px] font-mono text-white/60">OFFLINE RIG // {racer.serial}</span>
        </div>
      )}

      {/* Bottom vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Inspect Badge (appears on card ready) */}
      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono font-bold text-white opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20">
        <span>TAP DOSSIER</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  );
}

export default RacerCardVisual;
