/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Radio } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'JOURNEY', href: '#journey' },
    { label: 'RACERS', href: '#racers' },
    { label: 'GAME', href: '#game' },
    { label: 'TOKEN', href: '#token' },
    { label: 'ROADMAP', href: '#roadmap' },
    { label: 'MANIFESTO', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent py-5 sm:py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand with checkered racing mark & issue stamp */}
        <div className="flex items-center gap-4">
          <a
            href="#hero"
            id="brand-logo-link"
            aria-label="LASTLAP"
            className="flex items-center gap-3 no-underline group select-none"
          >
            <div className="w-10 h-7 rounded border border-white/80 p-0.5 grid grid-cols-3 grid-rows-2 gap-0.5 bg-black/60 group-hover:border-white transition-colors">
              <div className="bg-white rounded-xs"></div>
              <div className="bg-transparent"></div>
              <div className="bg-white rounded-xs"></div>
              <div className="bg-transparent"></div>
              <div className="bg-white rounded-xs"></div>
              <div className="bg-transparent"></div>
            </div>
            <span
              className="text-white text-xl sm:text-2xl font-black tracking-wide uppercase"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.06em' }}
            >
              LASTLAP
            </span>
          </a>

          <span className="hidden xl:inline-block px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/50 tracking-widest uppercase">
            ISSUE 01 // VOL. 2525
          </span>
        </div>

        {/* Desktop Links */}
        <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              className="text-white/75 hover:text-white text-xs font-mono font-semibold tracking-widest uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Actions & Telemetry Clock */}
        <div className="hidden sm:flex items-center gap-4">
          {timeStr && (
            <span className="hidden md:inline-block font-mono text-[11px] text-white/50 tracking-wider">
              {timeStr}
            </span>
          )}
          <a
            href="#racers"
            id="header-cta-btn"
            className="px-5 py-2.5 bg-white text-black font-black text-xs font-mono tracking-widest uppercase rounded-xl hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer no-underline"
          >
            MEET RACERS
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="p-2 text-white hover:bg-white/10 rounded cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="lg:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8 space-y-5 animate-fadeIn"
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-sm font-mono tracking-widest uppercase hover:text-white/70 py-1.5 no-underline"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href="#racers"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 bg-white text-black font-black text-center text-xs font-mono tracking-widest uppercase rounded-xl no-underline"
            >
              MEET THE RACERS
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
