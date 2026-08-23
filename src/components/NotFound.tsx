/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {
  onGoHome?: () => void;
}

export default function NotFound({ onGoHome }: NotFoundProps) {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/');
    }
  };

  return (
    <main
      id="lastlap-404-page"
      className="relative w-full min-h-screen overflow-x-hidden bg-black text-white select-none"
      style={{
        fontFamily: '"Geist Mono:SemiBold", monospace',
        fontWeight: 600,
      }}
    >
      {/* Background Video */}
      <video
        id="bg-video"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260801_001207_ec20d138-aa45-4b2b-ab8c-bdc71607f240.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          zIndex: 0,
          opacity: 1,
        }}
      />

      {/* Header Logo (LASTLAP) */}
      <header
        id="header-logo"
        aria-label="LASTLAP"
        onClick={handleReturnHome}
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center top-[32px] sm:top-[80px] scale-75 sm:scale-100 origin-top cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          zIndex: 10,
        }}
      >
        <div
          id="logo-frame"
          className="flex items-center gap-[14px]"
          style={{ width: '233px', height: '40px' }}
        >
          {/* Hand-drawn checkered racing flag / rally mark */}
          <svg
            id="rally-mark"
            width="54"
            height="40"
            viewBox="0 0 54 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="1" y="1" width="52" height="38" rx="4" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M18 1V39M36 1V39M1 13H53M1 27H53" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="2" y="2" width="15" height="10" fill="#FFFFFF" rx="2" />
            <rect x="37" y="2" width="15" height="10" fill="#FFFFFF" rx="2" />
            <rect x="19" y="14" width="16" height="12" fill="#FFFFFF" />
            <rect x="2" y="28" width="15" height="10" fill="#FFFFFF" rx="2" />
            <rect x="37" y="28" width="15" height="10" fill="#FFFFFF" rx="2" />
          </svg>

          {/* LASTLAP Logotype */}
          <span
            id="lastlap-wordmark"
            className="text-white tracking-[-1.5px] uppercase leading-none"
            style={{
              fontFamily: '"Geist Mono:SemiBold", monospace',
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            LASTLAP
          </span>
        </div>
      </header>

      {/* Centered 404 Content */}
      <section
        id="centered-404-content"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center w-[min(100%-40px,360px)] sm:w-[483px] gap-[28px] sm:gap-[44px]"
        style={{
          zIndex: 10,
        }}
      >
        {/* 1. 404 Heading */}
        <h1
          id="heading-404"
          className="heading-404 select-none pb-2 sm:pb-4 text-white text-[120px] sm:text-[180px] leading-none font-bold"
          style={{
            fontFamily: '"Geist Mono:SemiBold", monospace',
          }}
        >
          404
        </h1>

        {/* 2. Divider */}
        <div
          id="content-divider"
          className="w-full sm:w-[425px] h-[1px] bg-[#FFFFFF] shrink-0"
        />

        {/* 3. Message */}
        <div
          id="error-message-container"
          onClick={handleReturnHome}
          className="w-full cursor-pointer hover:opacity-80 transition-opacity"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleReturnHome();
          }}
        >
          <p
            id="error-message"
            className="text-white text-center select-none text-[clamp(15px,4.2vw,19px)] sm:text-[24px] tracking-[-1.2px] sm:tracking-[-2px] leading-[1.1] w-full"
            style={{
              fontFamily: '"Geist Mono:SemiBold", monospace',
              fontWeight: 600,
            }}
          >
            OFF THE ROUTE. CHECKPOINT NOT FOUND. RETURN TO THE GRID.
          </p>
        </div>
      </section>
    </main>
  );
}
