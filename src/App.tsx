/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeParallax from './components/MarqueeParallax';
import JourneyStrip from './components/JourneyStrip';
import MeetTheRacers from './components/MeetTheRacers';
import RacingGame from './components/RacingGame';
import LapToken from './components/LapToken';
import Roadmap from './components/Roadmap';
import AboutStory from './components/AboutStory';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import SmoothScroll from './components/SmoothScroll';
import LoadingScreen from './components/LoadingScreen';
import { MagneticCursor } from './components/ui/magnetic-cursor';
import { useScrollVelocitySkew } from './hooks/useScrollVelocitySkew';

function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#060606] text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <Navbar />

      {/* 1. Hero Section with GSAP Parallax */}
      <Hero />

      {/* 2. Kinetic Typographic Parallax Marquee */}
      <MarqueeParallax />

      {/* 3. Journey Strip (Collect → Race → Earn) */}
      <JourneyStrip />

      {/* 4. Meet the Racers (Lookbook Dossier & Interactive Filters) */}
      <MeetTheRacers />

      {/* 5. Game: Enter the Final Lap (Hidden for now) */}
      {/* <RacingGame /> */}

      {/* 6. LAP Token Manifest */}
      <LapToken />

      {/* 7. Roadmap (Rally Checkpoints) */}
      <Roadmap />

      {/* 8. About & Origin Story */}
      <AboutStory />

      {/* 9. Frequently Asked Questions (FAQ) */}
      <FAQ />

      {/* 10. Final CTA & Editorial Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <MagneticCursor
        magneticFactor={0.35}
        blendMode="exclusion"
        cursorSize={28}
        hoverPadding={10}
        speedMultiplier={0.025}
        contrastBoost={1.5}
      >
        <SmoothScroll>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SmoothScroll>
      </MagneticCursor>
    </>
  );
}

