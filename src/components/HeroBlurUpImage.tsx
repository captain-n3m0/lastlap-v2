/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface HeroBlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  accentColor?: string;
  objectFit?: 'contain' | 'cover';
  objectPosition?: string;
  draggable?: boolean;
}

export default function HeroBlurUpImage({
  src,
  alt,
  className = '',
  style = {},
  priority = false,
  accentColor = '#A94E34',
  objectFit = 'contain',
  objectPosition = 'bottom center',
  draggable = false,
}: HeroBlurUpImageProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Reset loaded status if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;
    if (img.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        ...style,
      }}
    >
      {/* 1. Low-resolution Blur-Up placeholder layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out flex items-center justify-center"
        style={{
          opacity: isLoaded ? 0 : 1,
          zIndex: 1,
        }}
      >
        {/* Ambient atmospheric glow in racer theme color */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${accentColor}44 0%, ${accentColor}11 50%, transparent 80%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Low-res silhouette with subtle pulse animation during load */}
        <div className="relative w-full h-full flex items-end justify-center pb-4">
          <div
            className="w-3/4 h-3/4 rounded-full opacity-30 animate-pulse"
            style={{
              background: accentColor,
              filter: 'blur(32px)',
            }}
          />
        </div>
      </div>

      {/* 2. Main High-Res Image with progressive blur-up transition */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        draggable={draggable}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className="relative z-10 w-full h-full transition-all duration-700 ease-out"
        style={{
          objectFit,
          objectPosition,
          filter: isLoaded ? 'blur(0px)' : 'blur(12px)',
          opacity: isLoaded ? 1 : 0.4,
          transform: isLoaded ? 'scale(1)' : 'scale(1.03)',
        }}
      />

      {/* 3. Fallback state if asset fails to load */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-sm text-center">
          <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
            SIGNAL RE-ACQUIRING
          </span>
        </div>
      )}
    </div>
  );
}
